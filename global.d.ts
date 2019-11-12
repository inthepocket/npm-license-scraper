declare type CLIFlags = Partial<{
  export: boolean | string;
  exclude: string[] | boolean;
  includeDev: boolean;
}>;

declare interface PackageJSON {
  version: string;
  license?: string;
  repository?: {
    url: string;
  };
  homepage?: string;
}

declare interface PackageInfo extends Omit<PackageJSON, 'homepage' | 'repository'> {
  licenseURL?: 'string';
  url?: string;
}
