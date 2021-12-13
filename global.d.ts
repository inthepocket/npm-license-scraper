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
