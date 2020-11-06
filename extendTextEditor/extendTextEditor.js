import { LightningElement } from "lwc";

export default class ExtendTextEditor extends LightningElement {
  story = "";
  rendered;

  renderedCallback() {
    if (!this.rendered) {
      this.focusTextArea();
      this.rendered = true;
    }
  }

  handleClose() {
    this.focusTextArea();
  }

  focusTextArea() {
    const inputArea = this.template.querySelector("lightning-textarea");
    inputArea.focus();
  }

  handleTextAreaChange(event) {
    const input = event.target.value;
    this.story = input;

    const index = input.lastIndexOf("#");
    if (index >= 0) {
      this.template.querySelector("c-modal").show();
    }
  }

  handleRowSelected(event) {
    const message = event.detail.message;
    this.story = this.story.slice(0, -1).concat(" " + message);
  }
}