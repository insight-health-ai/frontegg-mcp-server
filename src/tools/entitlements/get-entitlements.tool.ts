import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  buildFronteggUrl,
  createBaseHeaders,
  fetchFromFrontegg,
  formatToolResponse,
  FronteggEndpoints,
  HttpMethods,
} from "../../utils/api/frontegg-api";

const getEntitlementsSchema = z
  .object({
    tenantIds: z
      .union([z.string(), z.array(z.string())])
      .describe(
        "Tenant IDs to fetch entitlements for. Can be a comma-separated string or an array of tenant IDs."
      ),
    ids: z
      .string()
      .optional()
      .describe("Optional comma-separated entitlement IDs to filter by."),
    withRelations: z
      .boolean()
      .optional()
      .describe("Include entitlement relations in the response."),
    withTotalPages: z
      .boolean()
      .optional()
      .describe("Include pagination metadata such as total pages."),
    pageOffset: z
      .number()
      .int()
      .gte(0)
      .optional()
      .describe("Pagination offset (zero-based)."),
    pageSize: z
      .number()
      .int()
      .gt(0)
      .optional()
      .describe("Pagination page size."),
    sortBy: z
      .string()
      .optional()
      .describe("Sort field for entitlements list."),
    order: z
      .enum(["ASC", "DESC"])
      .optional()
      .describe("Sort order (ASC or DESC)."),
  })
  .strict();

type GetEntitlementsArgs = z.infer<typeof getEntitlementsSchema>;

export function registerGetEntitlementsTool(server: McpServer) {
  server.tool(
    "get-entitlements",
    "Fetches entitlements for one or more tenants using the Frontegg entitlements API.",
    getEntitlementsSchema.shape,
    async (args: GetEntitlementsArgs) => {
      const apiUrl = buildFronteggUrl(FronteggEndpoints.ENTITLEMENTS_V2);
      const normalizedArgs: Record<string, string | number | boolean> = {
        ...args,
        tenantIds: Array.isArray(args.tenantIds)
          ? args.tenantIds.join(",")
          : args.tenantIds,
      };

      Object.entries(normalizedArgs).forEach(([key, value]) => {
        if (value !== undefined) {
          apiUrl.searchParams.append(key, String(value));
        }
      });

      const response = await fetchFromFrontegg(
        HttpMethods.GET,
        apiUrl,
        createBaseHeaders(),
        undefined,
        "get-entitlements"
      );

      return formatToolResponse(response);
    }
  );
}
