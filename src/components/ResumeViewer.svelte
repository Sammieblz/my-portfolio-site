<script>
    export let window;

    let pdfUrl = '/document/SamuelNdubuisiResume-Latest.pdf';
    let loading = true;
    let error = null;
    let zoom = 100;
    let showDownloadOptions = false;
    let iframeRef;

    function handleLoad() {
        loading = false;
        error = null;
    }

    function handleError() {
        loading = false;
        error = 'Failed to load PDF. Please try downloading the file.';
    }

    function checkIframeLoad() {
        setTimeout(() => {
            if (iframeRef && iframeRef.contentDocument && iframeRef.contentDocument.body && iframeRef.contentDocument.body.children.length > 0) {
                handleLoad();
            } else {
                // If PDF doesn't load in iframe, automatically open in new tab
                console.log("PDF failed to load in iframe, opening in new tab");
                openInNewTab();
                handleError();
            }
        }, 3000);
    }

    function downloadResume() {
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = 'Samuel_Ndubuisi_Resume.pdf';
        link.click();
    }

    function openInNewTab() {
        window.open(pdfUrl, '_blank');
    }

    function adjustZoom(delta) {
        zoom = Math.max(50, Math.min(200, zoom + delta));
    }

    function resetZoom() {
        zoom = 100;
    }
</script>

<div class="w-full h-full file-manager overflow-hidden flex flex-col">

    <!-- Toolbar -->
    <div class="px-4 py-2 border-b border-gray-600 flex items-center justify-between">
        <div class="flex items-center gap-2">
            <button
                class="px-3 py-1 text-xs rounded hover:bg-gray-600 flex items-center gap-2"
                on:click={() => showDownloadOptions = !showDownloadOptions}
            >
                <i class="fas fa-download"></i>
                Download
            </button>
            <button
                class="px-3 py-1 text-xs rounded hover:bg-gray-600 flex items-center gap-2"
                on:click={openInNewTab}
            >
                <i class="fas fa-external-link-alt"></i>
                Open in New Tab
            </button>
        </div>
        
        <div class="flex items-center gap-2">
            <button
                class="px-2 py-1 text-xs rounded hover:bg-gray-600"
                on:click={() => adjustZoom(-25)}
            >
                <i class="fas fa-search-minus"></i>
            </button>
            <span class="text-xs text-gray-400 min-w-[3rem] text-center">
                {zoom}%
            </span>
            <button
                class="px-2 py-1 text-xs rounded hover:bg-gray-600"
                on:click={() => adjustZoom(25)}
            >
                <i class="fas fa-search-plus"></i>
            </button>
            <button
                class="px-2 py-1 text-xs rounded hover:bg-gray-600"
                on:click={resetZoom}
            >
                <i class="fas fa-expand-arrows-alt"></i>
            </button>
        </div>
    </div>

    <!-- Download Options Dropdown -->
    {#if showDownloadOptions}
        <div class="px-4 py-2 border-b border-gray-600 bg-gray-700">
            <div class="flex gap-2">
                <button
                    class="px-3 py-1 text-xs rounded bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                    on:click={downloadResume}
                >
                    <i class="fas fa-download"></i>
                    Download PDF
                </button>
                <button
                    class="px-3 py-1 text-xs rounded bg-green-600 hover:bg-green-700 flex items-center gap-2"
                    on:click={openInNewTab}
                >
                    <i class="fas fa-external-link-alt"></i>
                    Open in Browser
                </button>
            </div>
        </div>
    {/if}

    <!-- PDF Content -->
    <div class="flex-1 overflow-auto bg-gray-100 p-4">
        {#if loading}
            <div class="flex items-center justify-center h-64">
                <div class="text-center">
                    <i class="fas fa-spinner fa-spin text-3xl kali-blue mb-4"></i>
                    <div class="text-gray-400">Loading resume...</div>
                </div>
            </div>
        {:else if error}
            <div class="text-center py-8">
                <i class="fas fa-exclamation-triangle text-3xl kali-red mb-4"></i>
                <div class="text-red-400 mb-2">PDF Viewer Not Available</div>
                <div class="text-gray-400 text-sm mb-4">Your browser doesn't support PDF viewing in this window.</div>
                <div class="flex flex-col sm:flex-row gap-3 justify-center items-center">
                    <button
                        class="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                        on:click={openInNewTab}
                    >
                        <i class="fas fa-external-link-alt"></i>
                        Open in Browser
                    </button>
                    <button
                        class="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                        on:click={downloadResume}
                    >
                        <i class="fas fa-download"></i>
                        Download PDF
                    </button>
                </div>
            </div>
        {:else}
            <div class="flex justify-center">
                <iframe
                    bind:this={iframeRef}
                    src={pdfUrl}
                    class="border border-gray-300 rounded shadow-lg"
                    style="width: {zoom}%; height: {zoom * 1.4}px;"
                    title="Samuel Ndubuisi Resume PDF"
                    on:load={checkIframeLoad}
                    on:error={handleError}
                ></iframe>
            </div>
        {/if}
    </div>

    <!-- Footer -->
    <div class="px-4 py-2 border-t border-gray-600 bg-gray-800 text-xs text-gray-400">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
                <span>Samuel Ndubuisi - Full Stack Developer</span>
                <span>•</span>
                <span>Last updated: {new Date().toLocaleDateString()}</span>
            </div>
            <div class="flex items-center gap-2">
                <i class="fas fa-file-pdf kali-red"></i>
                <span>PDF Document</span>
            </div>
        </div>
    </div>
</div>
