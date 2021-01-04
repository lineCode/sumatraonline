<script>
    import { onMount, onDestroy } from "svelte";
    import { router } from "./router.js";
    import FS from "https://cdn.skypack.dev/@isomorphic-git/lightning-fs";
    import { AppOptions } from "./pdfjs/web/app_options.js";
    import { PDFViewerApplication } from "./pdfjs/web/app.js";

    export let fileName = "";

    window.PDFViewerApplication = PDFViewerApplication;
    window.PDFViewerApplicationOptions = AppOptions;

    function getViewerConfiguration() {
        return {
            appContainer: document.body,
            mainContainer: document.getElementById("viewerContainer"),
            viewerContainer: document.getElementById("viewer"),
            eventBus: null,
            toolbar: {
                container: document.getElementById("toolbarViewer"),
                numPages: document.getElementById("numPages"),
                pageNumber: document.getElementById("pageNumber"),
                scaleSelectContainer: document.getElementById(
                    "scaleSelectContainer"
                ),
                scaleSelect: document.getElementById("scaleSelect"),
                customScaleOption: document.getElementById("customScaleOption"),
                previous: document.getElementById("previous"),
                next: document.getElementById("next"),
                zoomIn: document.getElementById("zoomIn"),
                zoomOut: document.getElementById("zoomOut"),
                viewFind: document.getElementById("viewFind"),
                openFile: document.getElementById("openFile"),
                print: document.getElementById("print"),
                presentationModeButton: document.getElementById(
                    "presentationMode"
                ),
                download: document.getElementById("download"),
                viewBookmark: document.getElementById("viewBookmark"),
            },
            secondaryToolbar: {
                toolbar: document.getElementById("secondaryToolbar"),
                toggleButton: document.getElementById("secondaryToolbarToggle"),
                toolbarButtonContainer: document.getElementById(
                    "secondaryToolbarButtonContainer"
                ),
                presentationModeButton: document.getElementById(
                    "secondaryPresentationMode"
                ),
                openFileButton: document.getElementById("secondaryOpenFile"),
                printButton: document.getElementById("secondaryPrint"),
                downloadButton: document.getElementById("secondaryDownload"),
                viewBookmarkButton: document.getElementById(
                    "secondaryViewBookmark"
                ),
                firstPageButton: document.getElementById("firstPage"),
                lastPageButton: document.getElementById("lastPage"),
                pageRotateCwButton: document.getElementById("pageRotateCw"),
                pageRotateCcwButton: document.getElementById("pageRotateCcw"),
                cursorSelectToolButton: document.getElementById(
                    "cursorSelectTool"
                ),
                cursorHandToolButton: document.getElementById("cursorHandTool"),
                scrollVerticalButton: document.getElementById("scrollVertical"),
                scrollHorizontalButton: document.getElementById(
                    "scrollHorizontal"
                ),
                scrollWrappedButton: document.getElementById("scrollWrapped"),
                spreadNoneButton: document.getElementById("spreadNone"),
                spreadOddButton: document.getElementById("spreadOdd"),
                spreadEvenButton: document.getElementById("spreadEven"),
                documentPropertiesButton: document.getElementById(
                    "documentProperties"
                ),
            },
            fullscreen: {
                contextFirstPage: document.getElementById("contextFirstPage"),
                contextLastPage: document.getElementById("contextLastPage"),
                contextPageRotateCw: document.getElementById(
                    "contextPageRotateCw"
                ),
                contextPageRotateCcw: document.getElementById(
                    "contextPageRotateCcw"
                ),
            },
            sidebar: {
                // Divs (and sidebar button)
                outerContainer: document.getElementById("outerContainer"),
                viewerContainer: document.getElementById("viewerContainer"),
                toggleButton: document.getElementById("sidebarToggle"),
                // Buttons
                thumbnailButton: document.getElementById("viewThumbnail"),
                outlineButton: document.getElementById("viewOutline"),
                attachmentsButton: document.getElementById("viewAttachments"),
                layersButton: document.getElementById("viewLayers"),
                // Views
                thumbnailView: document.getElementById("thumbnailView"),
                outlineView: document.getElementById("outlineView"),
                attachmentsView: document.getElementById("attachmentsView"),
                layersView: document.getElementById("layersView"),
            },
            sidebarResizer: {
                outerContainer: document.getElementById("outerContainer"),
                resizer: document.getElementById("sidebarResizer"),
            },
            findBar: {
                bar: document.getElementById("findbar"),
                toggleButton: document.getElementById("viewFind"),
                findField: document.getElementById("findInput"),
                highlightAllCheckbox: document.getElementById(
                    "findHighlightAll"
                ),
                caseSensitiveCheckbox: document.getElementById("findMatchCase"),
                entireWordCheckbox: document.getElementById("findEntireWord"),
                findMsg: document.getElementById("findMsg"),
                findResultsCount: document.getElementById("findResultsCount"),
                findPreviousButton: document.getElementById("findPrevious"),
                findNextButton: document.getElementById("findNext"),
            },
            passwordOverlay: {
                overlayName: "passwordOverlay",
                container: document.getElementById("passwordOverlay"),
                label: document.getElementById("passwordText"),
                input: document.getElementById("password"),
                submitButton: document.getElementById("passwordSubmit"),
                cancelButton: document.getElementById("passwordCancel"),
            },
            documentProperties: {
                overlayName: "documentPropertiesOverlay",
                container: document.getElementById("documentPropertiesOverlay"),
                closeButton: document.getElementById("documentPropertiesClose"),
                fields: {
                    fileName: document.getElementById("fileNameField"),
                    fileSize: document.getElementById("fileSizeField"),
                    title: document.getElementById("titleField"),
                    author: document.getElementById("authorField"),
                    subject: document.getElementById("subjectField"),
                    keywords: document.getElementById("keywordsField"),
                    creationDate: document.getElementById("creationDateField"),
                    modificationDate: document.getElementById(
                        "modificationDateField"
                    ),
                    creator: document.getElementById("creatorField"),
                    producer: document.getElementById("producerField"),
                    version: document.getElementById("versionField"),
                    pageCount: document.getElementById("pageCountField"),
                    pageSize: document.getElementById("pageSizeField"),
                    linearized: document.getElementById("linearizedField"),
                },
            },
            errorWrapper: {
                container: document.getElementById("errorWrapper"),
                errorMessage: document.getElementById("errorMessage"),
                closeButton: document.getElementById("errorClose"),
                errorMoreInfo: document.getElementById("errorMoreInfo"),
                moreInfoButton: document.getElementById("errorShowMore"),
                lessInfoButton: document.getElementById("errorShowLess"),
            },
            printContainer: document.getElementById("printContainer"),
            openFileInputName: "fileInput",
            debuggerScriptPath: "./debugger.js",
        };
    }

    async function handleOnMount() {
        console.log("PDFJSViewer: handleOnMount: loading file", fileName);
        // must patch overflow for 
        //document.getElementsByTagName('body')[0].style.overflow = "hidden";
        const fs = new FS("files").promises;
        let file;
        try {
            file = await fs.readFile("/" + fileName);
        } catch (ex) {
            // do nothing
            console.log(
                "PDFJSViewer: handleOnMount: fs.ReadFile() failed with",
                ex
            );
        }
        if (!file) {
            console.log("no file, going back to /");
            router.run("/");
            return;
        }
        console.log("not opening the file");
        const ab = file.buffer;
        const config = getViewerConfiguration();
        config.file = ab;

        Promise.all([
            import("pdfjs-web/genericcom.js"),
            import("pdfjs-web/pdf_print_service.js"),
        ]).then(function ([genericCom, pdfPrintService]) {
            console.log("PDFViewerApplication.run");
            PDFViewerApplication.run(config);
        });
    }

    onMount(handleOnMount);
    onDestroy(() => {
        console.log("destroying viewer");
        PDFViewerApplication.close();
    });
</script>

<div id="outerContainer">
    <div id="sidebarContainer">
        <div id="toolbarSidebar">
            <div class="splitToolbarButton toggled">
                <button
                    id="viewThumbnail"
                    class="toolbarButton toggled"
                    title="Show Thumbnails"
                    tabindex="2"
                    data-l10n-id="thumbs">
                    <span data-l10n-id="thumbs_label">Thumbnails</span>
                </button>
                <button
                    id="viewOutline"
                    class="toolbarButton"
                    title="Show Document Outline (double-click to expand/collapse all items)"
                    tabindex="3"
                    data-l10n-id="document_outline">
                    <span data-l10n-id="document_outline_label">Document Outline</span>
                </button>
                <button
                    id="viewAttachments"
                    class="toolbarButton"
                    title="Show Attachments"
                    tabindex="4"
                    data-l10n-id="attachments">
                    <span data-l10n-id="attachments_label">Attachments</span>
                </button>
                <button
                    id="viewLayers"
                    class="toolbarButton"
                    title="Show Layers (double-click to reset all layers to the default state)"
                    tabindex="5"
                    data-l10n-id="layers">
                    <span data-l10n-id="layers_label">Layers</span>
                </button>
            </div>
        </div>
        <div id="sidebarContent">
            <div id="thumbnailView" />
            <div id="outlineView" class="hidden" />
            <div id="attachmentsView" class="hidden" />
            <div id="layersView" class="hidden" />
        </div>
        <div id="sidebarResizer" />
    </div>
    <!-- sidebarContainer -->

    <div id="mainContainer">
        <div class="findbar hidden doorHanger" id="findbar">
            <div id="findbarInputContainer">
                <input
                    id="findInput"
                    class="toolbarField"
                    title="Find"
                    placeholder="Find in document…"
                    tabindex="91"
                    data-l10n-id="find_input" />
                <div class="splitToolbarButton">
                    <button
                        id="findPrevious"
                        class="toolbarButton findPrevious"
                        title="Find the previous occurrence of the phrase"
                        tabindex="92"
                        data-l10n-id="find_previous">
                        <span data-l10n-id="find_previous_label">Previous</span>
                    </button>
                    <div class="splitToolbarButtonSeparator" />
                    <button
                        id="findNext"
                        class="toolbarButton findNext"
                        title="Find the next occurrence of the phrase"
                        tabindex="93"
                        data-l10n-id="find_next">
                        <span data-l10n-id="find_next_label">Next</span>
                    </button>
                </div>
            </div>

            <div id="findbarOptionsOneContainer">
                <input
                    type="checkbox"
                    id="findHighlightAll"
                    class="toolbarField"
                    tabindex="94" />
                <label
                    for="findHighlightAll"
                    class="toolbarLabel"
                    data-l10n-id="find_highlight">Highlight all</label>
                <input
                    type="checkbox"
                    id="findMatchCase"
                    class="toolbarField"
                    tabindex="95" />
                <label
                    for="findMatchCase"
                    class="toolbarLabel"
                    data-l10n-id="find_match_case_label">Match case</label>
            </div>
            <div id="findbarOptionsTwoContainer">
                <input
                    type="checkbox"
                    id="findEntireWord"
                    class="toolbarField"
                    tabindex="96" />
                <label
                    for="findEntireWord"
                    class="toolbarLabel"
                    data-l10n-id="find_entire_word_label">Whole words</label>
                <span id="findResultsCount" class="toolbarLabel hidden" />
            </div>

            <div id="findbarMessageContainer">
                <span id="findMsg" class="toolbarLabel" />
            </div>
        </div>
        <!-- findbar -->

        <div
            id="secondaryToolbar"
            class="secondaryToolbar hidden doorHangerRight">
            <div id="secondaryToolbarButtonContainer">
                <button
                    id="secondaryPresentationMode"
                    class="secondaryToolbarButton presentationMode visibleLargeView"
                    title="Switch to Presentation Mode"
                    tabindex="51"
                    data-l10n-id="presentation_mode">
                    <span data-l10n-id="presentation_mode_label">Presentation
                        Mode</span>
                </button>

                <button
                    id="secondaryOpenFile"
                    class="secondaryToolbarButton openFile visibleLargeView"
                    title="Open File"
                    tabindex="52"
                    data-l10n-id="open_file">
                    <span data-l10n-id="open_file_label">Open</span>
                </button>

                <button
                    id="secondaryPrint"
                    class="secondaryToolbarButton print visibleMediumView"
                    title="Print"
                    tabindex="53"
                    data-l10n-id="print">
                    <span data-l10n-id="print_label">Print</span>
                </button>

                <button
                    id="secondaryDownload"
                    class="secondaryToolbarButton download visibleMediumView"
                    title="Download"
                    tabindex="54"
                    data-l10n-id="download">
                    <span data-l10n-id="download_label">Download</span>
                </button>

                <a
                    href="#"
                    id="secondaryViewBookmark"
                    class="secondaryToolbarButton bookmark visibleSmallView"
                    title="Current view (copy or open in new window)"
                    tabindex="55"
                    data-l10n-id="bookmark">
                    <span data-l10n-id="bookmark_label">Current View</span>
                </a>

                <div class="horizontalToolbarSeparator visibleLargeView" />

                <button
                    id="firstPage"
                    class="secondaryToolbarButton firstPage"
                    title="Go to First Page"
                    tabindex="56"
                    data-l10n-id="first_page">
                    <span data-l10n-id="first_page_label">Go to First Page</span>
                </button>
                <button
                    id="lastPage"
                    class="secondaryToolbarButton lastPage"
                    title="Go to Last Page"
                    tabindex="57"
                    data-l10n-id="last_page">
                    <span data-l10n-id="last_page_label">Go to Last Page</span>
                </button>

                <div class="horizontalToolbarSeparator" />

                <button
                    id="pageRotateCw"
                    class="secondaryToolbarButton rotateCw"
                    title="Rotate Clockwise"
                    tabindex="58"
                    data-l10n-id="page_rotate_cw">
                    <span data-l10n-id="page_rotate_cw_label">Rotate Clockwise</span>
                </button>
                <button
                    id="pageRotateCcw"
                    class="secondaryToolbarButton rotateCcw"
                    title="Rotate Counterclockwise"
                    tabindex="59"
                    data-l10n-id="page_rotate_ccw">
                    <span data-l10n-id="page_rotate_ccw_label">Rotate
                        Counterclockwise</span>
                </button>

                <div class="horizontalToolbarSeparator" />

                <button
                    id="cursorSelectTool"
                    class="secondaryToolbarButton selectTool toggled"
                    title="Enable Text Selection Tool"
                    tabindex="60"
                    data-l10n-id="cursor_text_select_tool">
                    <span data-l10n-id="cursor_text_select_tool_label">Text
                        Selection Tool</span>
                </button>
                <button
                    id="cursorHandTool"
                    class="secondaryToolbarButton handTool"
                    title="Enable Hand Tool"
                    tabindex="61"
                    data-l10n-id="cursor_hand_tool">
                    <span data-l10n-id="cursor_hand_tool_label">Hand Tool</span>
                </button>

                <div class="horizontalToolbarSeparator" />

                <button
                    id="scrollVertical"
                    class="secondaryToolbarButton scrollModeButtons scrollVertical toggled"
                    title="Use Vertical Scrolling"
                    tabindex="62"
                    data-l10n-id="scroll_vertical">
                    <span data-l10n-id="scroll_vertical_label">Vertical
                        Scrolling</span>
                </button>
                <button
                    id="scrollHorizontal"
                    class="secondaryToolbarButton scrollModeButtons scrollHorizontal"
                    title="Use Horizontal Scrolling"
                    tabindex="63"
                    data-l10n-id="scroll_horizontal">
                    <span data-l10n-id="scroll_horizontal_label">Horizontal
                        Scrolling</span>
                </button>
                <button
                    id="scrollWrapped"
                    class="secondaryToolbarButton scrollModeButtons scrollWrapped"
                    title="Use Wrapped Scrolling"
                    tabindex="64"
                    data-l10n-id="scroll_wrapped">
                    <span data-l10n-id="scroll_wrapped_label">Wrapped Scrolling</span>
                </button>

                <div class="horizontalToolbarSeparator scrollModeButtons" />

                <button
                    id="spreadNone"
                    class="secondaryToolbarButton spreadModeButtons spreadNone toggled"
                    title="Do not join page spreads"
                    tabindex="65"
                    data-l10n-id="spread_none">
                    <span data-l10n-id="spread_none_label">No Spreads</span>
                </button>
                <button
                    id="spreadOdd"
                    class="secondaryToolbarButton spreadModeButtons spreadOdd"
                    title="Join page spreads starting with odd-numbered pages"
                    tabindex="66"
                    data-l10n-id="spread_odd">
                    <span data-l10n-id="spread_odd_label">Odd Spreads</span>
                </button>
                <button
                    id="spreadEven"
                    class="secondaryToolbarButton spreadModeButtons spreadEven"
                    title="Join page spreads starting with even-numbered pages"
                    tabindex="67"
                    data-l10n-id="spread_even">
                    <span data-l10n-id="spread_even_label">Even Spreads</span>
                </button>

                <div class="horizontalToolbarSeparator spreadModeButtons" />

                <button
                    id="documentProperties"
                    class="secondaryToolbarButton documentProperties"
                    title="Document Properties…"
                    tabindex="68"
                    data-l10n-id="document_properties">
                    <span data-l10n-id="document_properties_label">Document
                        Properties…</span>
                </button>
            </div>
        </div>
        <!-- secondaryToolbar -->

        <div class="toolbar">
            <div id="toolbarContainer">
                <div id="toolbarViewer">
                    <div id="toolbarViewerLeft">
                        <button
                            id="sidebarToggle"
                            class="toolbarButton"
                            title="Toggle Sidebar"
                            tabindex="11"
                            data-l10n-id="toggle_sidebar">
                            <span data-l10n-id="toggle_sidebar_label">Toggle
                                Sidebar</span>
                        </button>
                        <div class="toolbarButtonSpacer" />
                        <button
                            id="viewFind"
                            class="toolbarButton"
                            title="Find in Document"
                            tabindex="12"
                            data-l10n-id="findbar">
                            <span data-l10n-id="findbar_label">Find</span>
                        </button>
                        <div class="splitToolbarButton hiddenSmallView">
                            <button
                                class="toolbarButton pageUp"
                                title="Previous Page"
                                id="previous"
                                tabindex="13"
                                data-l10n-id="previous">
                                <span
                                    data-l10n-id="previous_label">Previous</span>
                            </button>
                            <div class="splitToolbarButtonSeparator" />
                            <button
                                class="toolbarButton pageDown"
                                title="Next Page"
                                id="next"
                                tabindex="14"
                                data-l10n-id="next">
                                <span data-l10n-id="next_label">Next</span>
                            </button>
                        </div>
                        <input
                            type="number"
                            id="pageNumber"
                            class="toolbarField pageNumber"
                            title="Page"
                            value="1"
                            size="4"
                            min="1"
                            tabindex="15"
                            data-l10n-id="page"
                            autocomplete="off" />
                        <span id="numPages" class="toolbarLabel" />
                    </div>
                    <div id="toolbarViewerRight">
                        <button
                            id="presentationMode"
                            class="toolbarButton presentationMode hiddenLargeView"
                            title="Switch to Presentation Mode"
                            tabindex="31"
                            data-l10n-id="presentation_mode">
                            <span
                                data-l10n-id="presentation_mode_label">Presentation
                                Mode</span>
                        </button>

                        <button
                            id="openFile"
                            class="toolbarButton openFile hiddenLargeView"
                            title="Open File"
                            tabindex="32"
                            data-l10n-id="open_file">
                            <span data-l10n-id="open_file_label">Open</span>
                        </button>

                        <button
                            id="print"
                            class="toolbarButton print hiddenMediumView"
                            title="Print"
                            tabindex="33"
                            data-l10n-id="print">
                            <span data-l10n-id="print_label">Print</span>
                        </button>

                        <button
                            id="download"
                            class="toolbarButton download hiddenMediumView"
                            title="Download"
                            tabindex="34"
                            data-l10n-id="download">
                            <span data-l10n-id="download_label">Download</span>
                        </button>
                        <a
                            href="#"
                            id="viewBookmark"
                            class="toolbarButton bookmark hiddenSmallView"
                            title="Current view (copy or open in new window)"
                            tabindex="35"
                            data-l10n-id="bookmark">
                            <span data-l10n-id="bookmark_label">Current View</span>
                        </a>

                        <div class="verticalToolbarSeparator hiddenSmallView" />

                        <button
                            id="secondaryToolbarToggle"
                            class="toolbarButton"
                            title="Tools"
                            tabindex="36"
                            data-l10n-id="tools">
                            <span data-l10n-id="tools_label">Tools</span>
                        </button>
                    </div>
                    <div id="toolbarViewerMiddle">
                        <div class="splitToolbarButton">
                            <button
                                id="zoomOut"
                                class="toolbarButton zoomOut"
                                title="Zoom Out"
                                tabindex="21"
                                data-l10n-id="zoom_out">
                                <span data-l10n-id="zoom_out_label">Zoom Out</span>
                            </button>
                            <div class="splitToolbarButtonSeparator" />
                            <button
                                id="zoomIn"
                                class="toolbarButton zoomIn"
                                title="Zoom In"
                                tabindex="22"
                                data-l10n-id="zoom_in">
                                <span data-l10n-id="zoom_in_label">Zoom In</span>
                            </button>
                        </div>
                        <span
                            id="scaleSelectContainer"
                            class="dropdownToolbarButton">
                            <select
                                id="scaleSelect"
                                title="Zoom"
                                tabindex="23"
                                data-l10n-id="zoom">
                                <option
                                    id="pageAutoOption"
                                    title=""
                                    value="auto"
                                    selected="selected"
                                    data-l10n-id="page_scale_auto">
                                    Automatic Zoom
                                </option>
                                <option
                                    id="pageActualOption"
                                    title=""
                                    value="page-actual"
                                    data-l10n-id="page_scale_actual">
                                    Actual Size
                                </option>
                                <option
                                    id="pageFitOption"
                                    title=""
                                    value="page-fit"
                                    data-l10n-id="page_scale_fit">
                                    Page Fit
                                </option>
                                <option
                                    id="pageWidthOption"
                                    title=""
                                    value="page-width"
                                    data-l10n-id="page_scale_width">
                                    Page Width
                                </option>
                                <option
                                    id="customScaleOption"
                                    title=""
                                    value="custom"
                                    disabled="disabled"
                                    hidden="true" />
                                <option
                                    title=""
                                    value="0.5"
                                    data-l10n-id="page_scale_percent"
                                    data-l10n-args="&lbrace; 'scale': 50 &rbrace;">
                                    50%
                                </option>
                                <option
                                    title=""
                                    value="0.75"
                                    data-l10n-id="page_scale_percent"
                                    data-l10n-args="&lbrace; 'scale': 75 &rbrace;">
                                    75%
                                </option>
                                <option
                                    title=""
                                    value="1"
                                    data-l10n-id="page_scale_percent"
                                    data-l10n-args="&lbrace; 'scale': 100 &rbrace;">
                                    100%
                                </option>
                                <option
                                    title=""
                                    value="1.25"
                                    data-l10n-id="page_scale_percent"
                                    data-l10n-args="&lbrace; 'scale': 125 &rbrace;">
                                    125%
                                </option>
                                <option
                                    title=""
                                    value="1.5"
                                    data-l10n-id="page_scale_percent"
                                    data-l10n-args="&lbrace; 'scale': 150 &rbrace;">
                                    150%
                                </option>
                                <option
                                    title=""
                                    value="2"
                                    data-l10n-id="page_scale_percent"
                                    data-l10n-args="&lbrace; 'scale': 200 &rbrace;">
                                    200%
                                </option>
                                <option
                                    title=""
                                    value="3"
                                    data-l10n-id="page_scale_percent"
                                    data-l10n-args="&lbrace; 'scale': 300 &rbrace;">
                                    300%
                                </option>
                                <option
                                    title=""
                                    value="4"
                                    data-l10n-id="page_scale_percent"
                                    data-l10n-args="&lbrace; 'scale:' 400 &rbrace;">
                                    400%
                                </option>
                            </select>
                        </span>
                    </div>
                </div>
                <div id="loadingBar">
                    <div class="progress">
                        <div class="glimmer" />
                    </div>
                </div>
            </div>
        </div>

        <menu type="context" id="viewerContextMenu">
            <menuitem
                id="contextFirstPage"
                label="First Page"
                data-l10n-id="first_page" />
            <menuitem
                id="contextLastPage"
                label="Last Page"
                data-l10n-id="last_page" />
            <menuitem
                id="contextPageRotateCw"
                label="Rotate Clockwise"
                data-l10n-id="page_rotate_cw" />
            <menuitem
                id="contextPageRotateCcw"
                label="Rotate Counter-Clockwise"
                data-l10n-id="page_rotate_ccw" />
        </menu>

        <div id="viewerContainer" tabindex="0">
            <div id="viewer" class="pdfViewer" />
        </div>

        <div id="errorWrapper" hidden="true">
            <div id="errorMessageLeft">
                <span id="errorMessage" />
                <button id="errorShowMore" data-l10n-id="error_more_info">
                    More Information
                </button>
                <button
                    id="errorShowLess"
                    data-l10n-id="error_less_info"
                    hidden="true">
                    Less Information
                </button>
            </div>
            <div id="errorMessageRight">
                <button id="errorClose" data-l10n-id="error_close">
                    Close
                </button>
            </div>
            <div class="clearBoth" />
            <textarea id="errorMoreInfo" hidden="true" readonly="readonly" />
        </div>
    </div>
    <!-- mainContainer -->

    <div id="overlayContainer" class="hidden">
        <div id="passwordOverlay" class="container hidden">
            <div class="dialog">
                <div class="row">
                    <p id="passwordText" data-l10n-id="password_label">
                        Enter the password to open this PDF file:
                    </p>
                </div>
                <div class="row">
                    <input type="password" id="password" class="toolbarField" />
                </div>
                <div class="buttonRow">
                    <button id="passwordCancel" class="overlayButton"><span
                            data-l10n-id="password_cancel">Cancel</span></button>
                    <button id="passwordSubmit" class="overlayButton"><span
                            data-l10n-id="password_ok">OK</span></button>
                </div>
            </div>
        </div>
        <div id="documentPropertiesOverlay" class="container hidden">
            <div class="dialog">
                <div class="row">
                    <span data-l10n-id="document_properties_file_name">File
                        name:</span>
                    <p id="fileNameField">-</p>
                </div>
                <div class="row">
                    <span data-l10n-id="document_properties_file_size">File
                        size:</span>
                    <p id="fileSizeField">-</p>
                </div>
                <div class="separator" />
                <div class="row">
                    <span data-l10n-id="document_properties_title">Title:</span>
                    <p id="titleField">-</p>
                </div>
                <div class="row">
                    <span
                        data-l10n-id="document_properties_author">Author:</span>
                    <p id="authorField">-</p>
                </div>
                <div class="row">
                    <span
                        data-l10n-id="document_properties_subject">Subject:</span>
                    <p id="subjectField">-</p>
                </div>
                <div class="row">
                    <span
                        data-l10n-id="document_properties_keywords">Keywords:</span>
                    <p id="keywordsField">-</p>
                </div>
                <div class="row">
                    <span
                        data-l10n-id="document_properties_creation_date">Creation
                        Date:</span>
                    <p id="creationDateField">-</p>
                </div>
                <div class="row">
                    <span
                        data-l10n-id="document_properties_modification_date">Modification
                        Date:</span>
                    <p id="modificationDateField">-</p>
                </div>
                <div class="row">
                    <span
                        data-l10n-id="document_properties_creator">Creator:</span>
                    <p id="creatorField">-</p>
                </div>
                <div class="separator" />
                <div class="row">
                    <span data-l10n-id="document_properties_producer">PDF
                        Producer:</span>
                    <p id="producerField">-</p>
                </div>
                <div class="row">
                    <span data-l10n-id="document_properties_version">PDF
                        Version:</span>
                    <p id="versionField">-</p>
                </div>
                <div class="row">
                    <span data-l10n-id="document_properties_page_count">Page
                        Count:</span>
                    <p id="pageCountField">-</p>
                </div>
                <div class="row">
                    <span data-l10n-id="document_properties_page_size">Page
                        Size:</span>
                    <p id="pageSizeField">-</p>
                </div>
                <div class="separator" />
                <div class="row">
                    <span data-l10n-id="document_properties_linearized">Fast Web
                        View:</span>
                    <p id="linearizedField">-</p>
                </div>
                <div class="buttonRow">
                    <button
                        id="documentPropertiesClose"
                        class="overlayButton"><span
                            data-l10n-id="document_properties_close">Close</span></button>
                </div>
            </div>
        </div>
        <!--#if !MOZCENTRAL-->
        <div id="printServiceOverlay" class="container hidden">
            <div class="dialog">
                <div class="row">
                    <span data-l10n-id="print_progress_message">Preparing
                        document for printing…</span>
                </div>
                <div class="row">
                    <progress value="0" max="100" />
                    <span
                        data-l10n-id="print_progress_percent"
                        data-l10n-args="&lbrace; 'progress': 0 &rbrace;"
                        class="relative-progress">0%</span>
                </div>
                <div class="buttonRow">
                    <button id="printCancel" class="overlayButton"><span
                            data-l10n-id="print_progress_close">Cancel</span></button>
                </div>
            </div>
        </div>
        <!--#endif-->
        <!--#if CHROME-->
        <!--#include viewer-snippet-chrome-overlays.html-->
        <!--#endif-->
    </div>
    <!-- overlayContainer -->
</div>
<!-- outerContainer -->
<div id="printContainer" />
