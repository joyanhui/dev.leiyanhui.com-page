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

      hugoPackages = with pkgs; [
        hugo
        go
        fish # 默认 shell（带 dev 主题）
      ];
    in
    {
      devShells.${system}.default = pkgs.mkShell {
        packages = hugoPackages;

        shellHook = ''
          echo "== dev.leiyanhui.com-page devShell =="
          echo "  hugo = $(hugo version 2>/dev/null | sed 's/Hugo Static Site Generator //')"
          echo "  go   = $(go version 2>/dev/null)"
          echo "  注：本仓库禁止本地构建/预览（CI 负责）；详见 AGENTS.md"
          # 默认落进 fish（带专门 dev 主题，与系统 bash/fish 明确区分）
          # 仅在交互式 TTY 下 exec，命令行模式（nix develop -c）保留原 shell
          if [ -t 0 ] && command -v fish >/dev/null 2>&1; then
            export __FISH_DEVSHELL=1
            exec fish
          fi
        '';
      };
    };
}
