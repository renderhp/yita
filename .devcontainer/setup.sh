#!/bin/bash

set -e  # Exit on any error

echo "🚀 Setting up LazyVim..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Neovim is installed
if ! command -v nvim &> /dev/null; then
    print_error "Neovim is not installed!"
    exit 1
fi

print_status "Neovim found: $(nvim --version | head -n1)"

# Backup existing Neovim config if it exists
if [ -d "$HOME/.config/nvim" ]; then
    print_warning "Existing Neovim config found. Creating backup..."
    mv "$HOME/.config/nvim" "$HOME/.config/nvim.bak.$(date +%Y%m%d_%H%M%S)"
fi

# Backup existing local share if it exists
if [ -d "$HOME/.local/share/nvim" ]; then
    print_warning "Existing Neovim data found. Creating backup..."
    mv "$HOME/.local/share/nvim" "$HOME/.local/share/nvim.bak.$(date +%Y%m%d_%H%M%S)"
fi

# Create config directory
mkdir -p "$HOME/.config"

# Clone LazyVim starter template
print_status "Cloning LazyVim starter template..."
git clone https://github.com/LazyVim/starter "$HOME/.config/nvim"

# Remove the .git directory from the starter template
print_status "Cleaning up git history..."
rm -rf "$HOME/.config/nvim/.git"

# Make the config directory writable
chmod -R 755 "$HOME/.config/nvim"

print_status "LazyVim installation complete!"
print_status "Run 'nvim' to start Neovim and let LazyVim install plugins automatically."