declare type CLIFlags = Partial<{
  export: boolean | string;
  exclude: string[] | boolean;
  includeDev: boolean;
}>;

declare interface PackageJSON {
  version: string;
  license?: string;
  repository?: {
    url?: string;
    baseUrl?: string;
  };
  homepage?: string;
  repo?: string;
}

declare interface PackageInfo
  extends Omit<PackageJSON, "homepage" | "repository"> {
  licenseURL?: "string";
  url?: string;
}
