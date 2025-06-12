#!/bin/bash
set -e

echo "🚀 Starting post-create setup..."

NVIM_CONFIG_DIR="$HOME/.config/nvim"

# Check if the Neovim config directory already exists.
if [ ! -d "$NVIM_CONFIG_DIR" ]; then
    echo "🔧 Neovim config not found. Cloning LazyVim starter..."
    git clone https://github.com/LazyVim/starter "$NVIM_CONFIG_DIR"
else
    echo "✅ Neovim config already exists. Skipping clone."
fi

echo "📦 Syncing LazyVim plugins..."
nvim --headless "+Lazy sync" +qa

echo "✅ Post-create setup complete!"