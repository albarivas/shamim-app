import { LightningElement, track, api } from "lwc";

const COLUMNS = [
  { label: "Snippet", fieldName: "tag" },
  { label: "Message", fieldName: "message" }
];
export default class Modal extends LightningElement {
  // Properties & Getters / Setters
  columns = COLUMNS;
  data = [];
  isModalOpen;
  justOpened;
  snippetMessage = "";
  snippetTag = "";

  @track snippetList = [
    { id: 1, tag: "#hwc", message: "Hello you are welcome to Bangladesh." },
    { id: 2, tag: "#lub", message: "Love you Bangladesh." },
    { id: 3, tag: "#hse", message: "Hello salesforce." }
  ];

  @api show() {
    this.isModalOpen = true;
    this.justOpened = true;
  }

  hide() {
    this.isModalOpen = false;
    this.fireCloseEvent();
  }

  get modalClass() { // TODO: using template if:true is more efficient
    if (this.isModalOpen) {
      return "slds-modal slds-fade-in-open";
    }
    return "slds-modal ";
  }

  get modalBackdropClass() {
    if (this.isModalOpen) {
      return "slds-backdrop slds-backdrop_open";
    }
    return "slds-backdrop";
  }

  // Lifecycle Hooks
  connectedCallback() {
    this.data = [...this.snippetList];
  }

  renderedCallback() {
    if (this.justOpened) {
      const inputBox = this.template.querySelector("[data-id='searchbox']");
      inputBox.focus();
      this.justOpened = false;
    }
  }

  // Handlers
  handleSearchInputChange(event) {
    //console.log("focus", this.template.querySelector("[data-id='searchbox']"));
    const regex = new RegExp(event.target.value, "gi");
    this.data = this.snippetList.filter((row) => regex.test(row.tag));

    this.clearSelectedRows();
  }

  handleTagChange(event) {
    this.snippetTag = event.target.value;
    console.log("snippetTag::", this.snippetTag);
  }
  handleMessageChange(event) {
    this.snippetMessage = event.target.value;
  }

  handleAddSnippet(event) {
    const currentSnippet = {
      id: this.snippetList + 1,
      tag: this.snippetTag,
      message: this.snippetMessage
    };
    this.snippetList = [currentSnippet, ...this.snippetList];
    this.refreshSearchSnippet();
    this.clearSelectedRows();
    this.snippetMessage = "";
    this.snippetTag = "";
  }

  handleRowSelected(event) {
    const selectedRows = event.detail.selectedRows;
    this.clearSelectedRows();
    if (selectedRows) {
      this.hide();
      this.fireRowSelectedEvent(selectedRows[0].message);
      this.refreshSearchSnippet();
    }

    console.log("selectedRows::", selectedRows[0].message);
  }

  // Aux methods
  clearSelectedRows() {
    this.template.querySelector("lightning-datatable").selectedRows = [];
  }

  fireRowSelectedEvent(message) {
    const event = new CustomEvent("rowselected", { detail: message });
    this.dispatchEvent(event);
  }

  fireCloseEvent() {
    const event = new CustomEvent("close");
    this.dispatchEvent(event);
  }

  refreshSearchSnippet() {
    this.data = this.snippetList;
    this.template.querySelector("[data-id='searchbox']").value = "";
  }
}