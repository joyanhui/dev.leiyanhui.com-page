{
  description = "Hugo 博客构建环境";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-26.05";
  };

  outputs =
    { self, nixpkgs }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs {
        inherit system;
        config = {
          allowUnfree = true;
        };
      };
    in
    {
      devShells.${system}.default = pkgs.mkShell {
        packages = with pkgs; [
          hugo
          go
        ];

        shellHook = ''
          echo "== dev.leiyanhui.com-page devShell =="
          echo "  hugo = $(hugo version 2>/dev/null | sed 's/Hugo Static Site Generator //')"
          echo "  go   = $(go version 2>/dev/null)"
          echo "  注：本仓库禁止本地构建/预览（CI 负责）；详见 AGENTS.md"
        '';
      };
    };
}
