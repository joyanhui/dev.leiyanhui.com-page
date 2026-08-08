{
  description = "Hugo 博客构建环境";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-26.05";
  };

  outputs =
    { nixpkgs, ... }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs {
        inherit system;
        config = {
          allowUnfree = true;
        };
      };

      pick =
        set: names:
        map (n: pkgs.lib.getAttrFromPath (pkgs.lib.splitString "." n) set) (pkgs.lib.splitString "|" names);
      pkgList = pick pkgs;

      basePackages = pkgList "hugo|go|fish";
    in
    {
      devShells.${system}.default = pkgs.mkShell {
        packages = basePackages;

        shellHook = ''
          echo "== dev.leiyanhui.com-page devShell =="
          echo "  hugo = $(hugo version 2>/dev/null | sed 's/Hugo Static Site Generator //') go = $(go version 2>/dev/null)"
          echo "  注：本仓库禁止本地构建/预览（CI 负责）；详见 AGENTS.md"
          if [ -t 0 ] && command -v fish >/dev/null 2>&1; then
            export __FISH_DEVSHELL=1
            exec fish
          fi
        '';
      };
    };
}
