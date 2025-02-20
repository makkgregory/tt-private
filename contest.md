## **Task 1**

Text editor for the chat input inspired by the ProseMirror library.
The editor is designed with the following key features:

### **Document Model**
- Represents text as a **hierarchical tree of nodes**, allowing flexible formatting and inline styling.

### **Flat Indexing Approach**
- Used to reference the **original DOM and document model**.
- Converts **browser selection into AST selection** and vice versa for accurate cursor positioning and text manipulation.

### **Modular Architecture**
- Supports **custom plugins, commands, nodes, and marks**.
- Allows extending functionality **without modifying the core editor code**.

### **Browser-Native Event Handling**
- Uses native events like **`beforeinput`**, **`keydown`**, and **`selectionchange`**.
- Ensures a **lightweight and responsive** editing experience.

### **Input & Paste Rules**
The editor implements **input and paste rules**, allowing automatic text formatting:
  - Typing `**bold**` converts to **bold text**.
  - Typing `*italic*` converts to *italic text*.
  - Typing `~~strikethrough~~` converts to ~~strikethrough text~~.
  - Typing `` `code` `` converts to `code`.
