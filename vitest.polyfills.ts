// jsdom has no AnimationEvent. Without it, React listens for the prefixed
// `webkitAnimationEnd` and `onAnimationEnd` never fires for `animationend`.
// This must load before react-dom, so it is its own setup file.
if (!("AnimationEvent" in window)) {
  class AnimationEvent extends Event {}
  Object.assign(window, { AnimationEvent });
}

// jsdom's <dialog> has no showModal()/close().
if (!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    if (!this.hasAttribute("open")) return;
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
}
