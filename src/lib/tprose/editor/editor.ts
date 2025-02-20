import { Attrs, DOMNode, DOMParser, DOMSerializer, Schema } from "../model";
import { EditorState, ORIGIN_DEFAULT, Selection } from "../state";
import { Renderer } from "../view";
import { createViewRef } from "../view/create-view-ref";
import { chainCommands } from "./commands/chain-commands";
import { Command } from "./commands/command";
import { InputHandler, ORIGIN_INPUT } from "./handlers/input-handler";
import { KeyboardHandler } from "./handlers/keyboard-handler";
import {
  ORIGIN_SELECTION,
  SelectionHandler,
} from "./handlers/selection-handler";
import { Plugin } from "./plugin";
import { PluginHost } from "./plugin-host";
import { getAttrs } from "./utils/get-attrs";
import { isActive } from "./utils/is-active";

export class Editor {
  readonly parser: DOMParser;
  readonly serializer: DOMSerializer;
  readonly schema: Schema;
  readonly pluginHost: PluginHost;
  readonly renderer: Renderer;
  private readonly keyboardHandler: KeyboardHandler;
  private readonly inputHandler: InputHandler;
  private readonly selectionHandler: SelectionHandler;
  private readonly abortController: AbortController;
  private _state: EditorState;

  constructor(readonly dom: HTMLElement & DOMNode, plugins: readonly Plugin[]) {
    this.abortController = new AbortController();
    this.pluginHost = new PluginHost(plugins);
    this.schema = Schema.fromSpec(this.pluginHost.schema());
    this.parser = new DOMParser(this.schema);
    this.serializer = new DOMSerializer();
    this.renderer = new Renderer(this.dom, this.serializer);
    this.keyboardHandler = new KeyboardHandler(this);
    this.inputHandler = new InputHandler(this);
    this.selectionHandler = new SelectionHandler(this);
    this._state = this.initialState();
    this.dom.tProseType = this.schema.docType;
    this.bind();
    this.pluginHost.onInit(this);
  }

  get state(): EditorState {
    return this._state;
  }

  isActive(type: string, attrs?: Attrs): boolean {
    return isActive(this.schema, this.state, type, attrs);
  }

  getAttrs(type: string): Attrs {
    return getAttrs(this.schema, this.state, type);
  }

  apply(...commands: Command[]): void {
    const single = chainCommands(...commands);
    const newState = single({
      state: this.state,
      schema: this.schema,
    });
    if (this.state.equals(newState)) {
      return;
    }
    this._state = newState;
    switch (newState.origin) {
      case ORIGIN_INPUT:
      case ORIGIN_SELECTION:
        break;
      default:
        this.renderer.render(newState.doc);
        const viewRef = createViewRef(this.dom);
        viewRef.select(newState.selection);
    }
    this.pluginHost.onUpdate(this);
  }

  destroy(): void {
    this.abortController.abort();
    this.pluginHost.onDestroy();
  }

  private initialState(): EditorState {
    const doc = this.schema.doc();
    const selection = Selection.create(doc, 0);
    return new EditorState(doc, selection, ORIGIN_DEFAULT);
  }

  private bind(): void {
    this.dom.addEventListener(
      "beforeinput",
      (event) => this.inputHandler.handleBeforeInput(event),
      this.abortController
    );
    this.dom.addEventListener(
      "input",
      (event) => this.inputHandler.handleInput(event as InputEvent),
      this.abortController
    );
    this.dom.addEventListener(
      "keydown",
      (event) => this.keyboardHandler.handle(event),
      this.abortController
    );
    this.dom.ownerDocument.addEventListener(
      "selectionchange",
      () => this.selectionHandler.handle(),
      this.abortController
    );
  }
}
