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

const getTenantPlansSchema = z
  .object({
    tenantId: z.string().describe("The tenant ID to fetch attached plans for."),
  })
  .strict();

type GetTenantPlansArgs = z.infer<typeof getTenantPlansSchema>;

export function registerGetTenantPlansTool(server: McpServer) {
  server.tool(
    "get-tenant-plans",
    "Fetches all plans attached to a specific tenant using the Frontegg entitlements API.",
    getTenantPlansSchema.shape,
    async (args: GetTenantPlansArgs) => {
      const endpointPath = `${FronteggEndpoints.ENTITLEMENTS_PLANS_BY_TENANT}/${args.tenantId}`;
      const apiUrl = buildFronteggUrl(endpointPath);

      const response = await fetchFromFrontegg(
        HttpMethods.GET,
        apiUrl,
        createBaseHeaders(),
        undefined,
        "get-tenant-plans"
      );

      return formatToolResponse(response);
    }
  );
}
