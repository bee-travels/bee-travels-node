MAX_JOBS=10

.PHONY: start
start:
ifeq ($(BEE_TRAVELS_ARGS),)
	-@yarn workspaces foreach -pi -j $(MAX_JOBS) --include ui-backend --include ui-frontend --include destination-v1 --include hotel-v1 run start 2>/dev/null || true
else
	-@yarn workspaces foreach -pi -j $(MAX_JOBS) --include ui-backend --include ui-frontend $(foreach word,$(BEE_TRAVELS_ARGS),--include=$(word)) run start 2>/dev/null || true
endif
