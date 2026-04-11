import {
  buildProductionChecks,
  verifyProductionChecks,
} from "@/lib/production-verification";

async function main() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://sbti.orangemust.com";
  const checks = buildProductionChecks(siteUrl);
  const results = await verifyProductionChecks(checks);
  const failedResults = results.filter((result) => !result.ok);

  for (const result of results) {
    const statusLabel = result.ok ? "PASS" : "FAIL";
    console.log(
      `[${statusLabel}] ${result.path} -> ${result.status} ${result.actualContentType || "(no content-type)"}`,
    );

    for (const error of result.errors) {
      console.log(`  - ${error}`);
    }
  }

  if (failedResults.length > 0) {
    process.exitCode = 1;
    return;
  }

  console.log(`Verified ${results.length} production routes successfully.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
