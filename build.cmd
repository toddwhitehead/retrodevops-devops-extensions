cd acme-cross-assemble-task
tsc
cd ..

cd acme-install-tool-task
tsc
cd ..

cd pucrunch-compress-task
tsc
cd ..

cd pucrunch-install-tool-task
tsc
cd ..

tfx extension create --rev-version --manifest-globsdir vss-extension.json