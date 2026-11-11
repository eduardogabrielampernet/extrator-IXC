chrome.sidePanel.setPanelBehavior({openPanelOnActionClick: true});
chrome.runtime.onUpdateAvailable.addListener(() => chrome.runtime.reload());