FROM archlinux:latest

RUN \
    # Refresh the package database and update all packages
    pacman -Syu --noconfirm && \
    # Initialize the pacman keyring
    pacman-key --init && \
    pacman-key --populate && \
    # Install core dependencies for development and plugins
    pacman -S --noconfirm \
    neovim \
    git \
    fish \
    sudo \
    base-devel \
    # --- Tools for LazyVim / Telescope ---
    ripgrep \
    fd \
    # --- Other useful tools ---
    unzip \
    wget \
    tmux \
    lazygit

RUN \
    useradd -m -s /usr/bin/fish renderhp && \
    # Give the user passwordless sudo privileges
    echo "renderhp ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers

USER renderhp

CMD [ "/usr/bin/fish" ]