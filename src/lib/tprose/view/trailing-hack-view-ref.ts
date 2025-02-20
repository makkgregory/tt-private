import { ViewRef } from "./view-ref";

export class TrailingHackViewRef extends ViewRef {
  get isHack(): boolean {
    return true;
  }
}
