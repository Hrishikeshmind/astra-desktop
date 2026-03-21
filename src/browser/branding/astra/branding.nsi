# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

# =============================================================================
# Astra Browser — Windows NSIS installer branding
# =============================================================================

# BrandFullNameInternal is used for some registry and file system values
# instead of BrandFullName and typically should not be modified.
!define BrandFullNameInternal "Astra Browser"
!define BrandFullName         "Astra Browser"
!define CompanyName           "Astra Browser Project"
!define URLInfoAbout          "https://astrabrowser.in"
!define HelpLink              "https://astrabrowser.in/support"

!define URLStubDownloadX86     "https://astrabrowser.in/download?os=win&arch=x86"
!define URLStubDownloadAMD64   "https://astrabrowser.in/download?os=win&arch=x64"
!define URLStubDownloadAArch64 "https://astrabrowser.in/download?os=win&arch=arm64"
!define URLManualDownload      "https://astrabrowser.in/download"
!define URLSystemRequirements  "https://astrabrowser.in/system-requirements"
!define Channel                "release"

# The installer's certificate name and issuer expected by the stub installer
!define CertNameDownload   "Astra Browser Project"
!define CertIssuerDownload "DigiCert Trusted G4 Code Signing RSA4096 SHA384 2021 CA1"

# Dialog unit layout (same as upstream — maintains correct DPI scaling)
!define PROFILE_CLEANUP_LABEL_TOP       "35u"
!define PROFILE_CLEANUP_LABEL_LEFT      "0"
!define PROFILE_CLEANUP_LABEL_WIDTH     "100%"
!define PROFILE_CLEANUP_LABEL_HEIGHT    "80u"
!define PROFILE_CLEANUP_LABEL_ALIGN     "center"
!define PROFILE_CLEANUP_CHECKBOX_LEFT   "center"
!define PROFILE_CLEANUP_CHECKBOX_WIDTH  "100%"
!define PROFILE_CLEANUP_BUTTON_LEFT     "center"
!define INSTALL_BLURB_TOP               "137u"
!define INSTALL_BLURB_WIDTH             "60u"
!define INSTALL_FOOTER_TOP              "-48u"
!define INSTALL_FOOTER_WIDTH            "250u"
!define INSTALL_INSTALLING_TOP          "70u"
!define INSTALL_INSTALLING_LEFT         "0"
!define INSTALL_INSTALLING_WIDTH        "100%"
!define INSTALL_PROGRESS_BAR_TOP        "112u"
!define INSTALL_PROGRESS_BAR_LEFT       "20%"
!define INSTALL_PROGRESS_BAR_WIDTH      "60%"
!define INSTALL_PROGRESS_BAR_HEIGHT     "12u"

!define PROFILE_CLEANUP_CHECKBOX_TOP_MARGIN   "20u"
!define PROFILE_CLEANUP_BUTTON_TOP_MARGIN     "20u"
!define PROFILE_CLEANUP_BUTTON_X_PADDING      "40u"
!define PROFILE_CLEANUP_BUTTON_Y_PADDING      "4u"

# Typography
!define INSTALL_HEADER_FONT_SIZE        28
!define INSTALL_HEADER_FONT_WEIGHT      400
!define INSTALL_INSTALLING_FONT_SIZE    28
!define INSTALL_INSTALLING_FONT_WEIGHT  400

# Astra sunset UI colors — deep indigo background, warm gold text
!define COMMON_TEXT_COLOR               0xF5E6C8
!define COMMON_BACKGROUND_COLOR         0x1A1035
!define INSTALL_INSTALLING_TEXT_COLOR   0xF0A500
