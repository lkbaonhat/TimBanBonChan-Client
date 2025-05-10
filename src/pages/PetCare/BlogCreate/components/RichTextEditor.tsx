import React from "react";
import FroalaEditor from "react-froala-wysiwyg";
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/js/plugins.pkgd.min.js";

interface RichTextEditorProps {
  content: string;
  onContentChange: (content: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onContentChange,
}) => {
  // Enhanced Froala editor configuration
  const editorConfig = {
    placeholderText: "Viết nội dung bài viết tại đây...",
    charCounterCount: true,
    theme: "royal", // Custom theme class (defined in froalaStyles.css)
    toolbarSticky: true,
    toolbarStickyOffset: 70,
    fontFamily: {
      "Roboto,sans-serif": "Roboto",
      "Open Sans,sans-serif": "Open Sans",
      "Montserrat,sans-serif": "Montserrat",
      "Arial,Helvetica,sans-serif": "Arial",
      "Georgia,serif": "Georgia",
    },
    fontFamilySelection: true,
    fontSizeSelection: true,
    paragraphFormat: {
      N: "Normal",
      H1: "Heading 1",
      H2: "Heading 2",
      H3: "Heading 3",
      H4: "Heading 4",
    },
    paragraphFormatSelection: true,
    toolbarButtons: {
      moreText: {
        buttons: [
          "bold",
          "italic",
          "underline",
          "strikeThrough",
          "fontFamily",
          "fontSize",
          "textColor",
          "backgroundColor",
          "clearFormatting",
        ],
        buttonsVisible: 5,
      },
      moreParagraph: {
        buttons: [
          "alignLeft",
          "alignCenter",
          "alignRight",
          "alignJustify",
          "formatOL",
          "formatUL",
          "paragraphFormat",
          "lineHeight",
          "outdent",
          "indent",
          "quote",
        ],
        buttonsVisible: 5,
      },
      moreRich: {
        buttons: [
          "insertLink",
          "insertImage",
          "insertTable",
          "emoticons",
          "specialCharacters",
          "insertHR",
        ],
        buttonsVisible: 3,
      },
      moreMisc: {
        buttons: ["undo", "redo", "fullscreen", "html", "print"],
        buttonsVisible: 2,
        align: "right",
      },
    },
    imageUploadURL: "/api/upload-image", // Replace with actual upload endpoint
    heightMin: 400,
    attribution: false, // Remove the Froala attribution
    zIndex: 10,
    pluginsEnabled: [
      "align",
      "charCounter",
      "codeBeautifier",
      "codeView",
      "colors",
      "draggable",
      "emoticons",
      "entities",
      "fontFamily",
      "fontSize",
      "fullscreen",
      "image",
      "imageManager",
      "inlineStyle",
      "lineBreaker",
      "lineHeight",
      "link",
      "lists",
      "paragraphFormat",
      "paragraphStyle",
      "quickInsert",
      "quote",
      "save",
      "table",
      "url",
      "wordPaste",
    ],
  };

  const handleEditorModelChange = (model: string) => {
    onContentChange(model);
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden froala-container">
      <FroalaEditor
        tag="textarea"
        model={content}
        onModelChange={handleEditorModelChange}
        config={editorConfig}
      />
    </div>
  );
};

export default RichTextEditor;
