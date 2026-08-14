{
  description = "Hugo 博客构建环境";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-26.05";
  };

  outputs =
    { nixpkgs, ... }:
    let
      env = import ./flake_pkgs_let.nix { inherit nixpkgs; };
      inherit (env)
        system
        pkgs
        basePackages
        docsPackages
        ;
    in
    {
      devShells.${system}.default = pkgs.mkShell {
        packages = basePackages.utils ++ docsPackages.hugo;

        shellHook = ''
          echo "== dev.leiyanhui.com-page devShell =="
          echo "  hugo = $(hugo version 2>/dev/null | sed 's/Hugo Static Site Generator //') go = $(go version 2>/dev/null)"
          echo "  注：本仓库禁止本地构建/预览（CI 负责）；详见 AGENTS.md"
          if command -v fish >/dev/null 2>&1; then
            export __FISH_DEVSHELL=1
            if [ -t 0 ]; then
              exec fish
            fi
          fi
        '';
      };
    };
}
