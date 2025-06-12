FROM archlinux:latest

# Install essential packages
RUN pacman -Syu --noconfirm && \
    pacman -S --noconfirm sudo git base-devel neovim fish curl wget

# Create user with fish as default shell
RUN useradd -m -s /usr/bin/fish renderhp && \
    echo "renderhp ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers

USER renderhp
WORKDIR /home/renderhp

COPY --chown=renderhp:renderhp setup.sh ./setup.sh
RUN chmod +x ./setup.sh

CMD ["fish"]