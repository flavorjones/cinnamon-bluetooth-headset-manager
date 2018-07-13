
INSTALL_PATH := $(HOME)/.local/share/cinnamon/applets

UUID := $(shell jq ".uuid" metadata.json)
ifndef UUID
	$(error "could not find uuid")
endif

APPLET_PATH = $(INSTALL_PATH)/$(UUID)
APPLET_FILES = metadata.json applet.js

default:
	@echo 'try: "make install"'

install:
	@echo "→ installing into $(APPLET_PATH) ..."
	mkdir -p $(APPLET_PATH)
	cp -f $(APPLET_FILES) $(APPLET_PATH)

uninstall:
	@echo "→ uninstalling from $(APPLET_PATH)"
	rm -rf $(APPLET_PATH)
