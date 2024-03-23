import { registerDestructor } from "@ember/destroyable";
import Modifier from "ember-modifier";
import { bind } from "discourse-common/utils/decorators";

/**
 * A modifier for handling swipe gestures on an element.
 *
 * This Ember modifier is designed to attach swipe gesture listeners to the provided
 * element and execute callback functions based on the swipe direction and movement.
 * It utilizes touch events to determine the swipe direction and magnitude.
 * Callbacks for swipe start, move, and end can be passed as arguments and will be called
 * with the current state of the swipe, including its direction, orientation, and delta values.
 *
 * @example
 * <div {{swipe didStartSwipe=this.didStartSwipe
 *            didSwipe=this.didSwipe
 *            didEndSwipe=this.didEndSwipe}}>
 *   Swipe here
 * </div>
 *
 * @extends Modifier
 */
export default class SwipeModifier extends Modifier {
  /**
   * The DOM element the modifier is attached to.
   * @type {Element}
   */
  element;

  constructor(owner, args) {
    super(owner, args);
    registerDestructor(this, (instance) => instance.cleanup(instance.element));
  }

  /**
   * Sets up the modifier by attaching event listeners for touch events to the element.
   *
   * @param {Element} element The DOM element to which the modifier is applied.
   * @param {unused} _ Unused parameter, placeholder for positional arguments.
   * @param {Object} options The named arguments passed to the modifier.
   * @param {Function} options.didStartSwipe Callback to be executed when a swipe starts.
   * @param {Function} options.didSwipe Callback to be executed when a swipe moves.
   * @param {Function} options.didEndSwipe Callback to be executed when a swipe ends.
   */
  modify(element, _, { didStartSwipe, didSwipe, didEndSwipe }) {
    this.element = element;
    this.didSwipeCallback = didSwipe;
    this.didStartSwipeCallback = didStartSwipe;
    this.didEndSwipeCallback = didEndSwipe;

    element.addEventListener("touchstart", this.handleTouchStart, {
      passive: true,
    });
    element.addEventListener("touchmove", this.handleTouchMove, {
      passive: true,
    });
    element.addEventListener("touchend", this.handleTouchEnd, {
      passive: true,
    });
  }

  /**
   * Handles the touchstart event.
   * Initializes the swipe state and executes the `didStartSwipe` callback.
   *
   * @param {TouchEvent} event The touchstart event object.
   */
  @bind
  handleTouchStart(event) {
    this.state = {
      initialY: event.touches[0].clientY,
      initialX: event.touches[0].clientX,
      deltaY: 0,
      deltaX: 0,
      direction: null,
      orientation: null,
    };

    this.didStartSwipeCallback?.(this.state);
  }

  /**
   * Handles the touchend event.
   * Executes the `didEndSwipe` callback.
   *
   * @param {TouchEvent} event The touchend event object.
   */
  @bind
  handleTouchEnd() {
    this.didEndSwipeCallback?.(this.state);
  }

  /**
   * Handles the touchmove event.
   * Updates the swipe state based on movement and executes the `didSwipe` callback.
   *
   * @param {TouchEvent} event The touchmove event object.
   */
  @bind
  handleTouchMove(event) {
    const touch = event.touches[0];
    const deltaY = this.state.initialY - touch.clientY;
    const deltaX = this.state.initialX - touch.clientX;

    this.state.direction =
      Math.abs(deltaY) > Math.abs(deltaX) ? "vertical" : "horizontal";
    this.state.orientation =
      this.state.direction === "vertical"
        ? deltaY > 0
          ? "up"
          : "down"
        : deltaX > 0
        ? "left"
        : "right";

    this.state.deltaY = deltaY;
    this.state.deltaX = deltaX;

    this.didSwipeCallback?.(this.state);
  }

  /**
   * Cleans up the modifier by removing event listeners from the element.
   *
   * @param {Element} element The DOM element from which to remove event listeners.
   */
  cleanup(element) {
    element.removeEventListener("touchstart", this.handleTouchStart);
    element.removeEventListener("touchmove", this.handleTouchMove);
    element.removeEventListener("touchend", this.handleTouchEnd);
  }
}
