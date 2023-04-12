export GIT_BRANCH=${GITHUB_REF#refs/heads/}
echo "GIT_BRANCH=$GIT_BRANCH" >> $GITHUB_OUTPUT
export GIT_TAG=$(git tag | grep $(git describe --tags HEAD))
echo "GIT_TAG=$GIT_TAG" >> $GITHUB_OUTPUT
export GIT_COMMIT_HEAD_MSG=$(git log --format=%b -1)
echo "GIT_COMMIT_HEAD_MSG=$GIT_COMMIT_HEAD_MSG" >> $GITHUB_OUTPUT
export GIT_COMMIT_SHORTCUTS=$(git log --format=%h -1)
echo "GIT_COMMIT_SHORTCUTS=$GIT_COMMIT_SHORTCUTS" >> $GITHUB_OUTPUT
export GIT_COMMIT_TIME=$(git show -s --format="%cd" --date=format:%Y%m%d%H%M%S HEAD)
echo "GIT_COMMIT_TIME=$GIT_COMMIT_TIME" >> $GITHUB_OUTPUT

if [[ "$GIT_TAG" =~ ^v?[012]\.[0-9]+\.[0-9]+$ ]]; then
    export IS_GIT_TAG_MATCH_SEMVER="true"
    echo "IS_GIT_TAG_MATCH_SEMVER=$IS_GIT_TAG_MATCH_SEMVER" >> $GITHUB_OUTPUT
fi

if [ -z "$GIT_TAG" ]; then
    export RELEASE_TAG="$GIT_COMMIT_TIME-$GIT_COMMIT_SHORTCUTS";
else
    export RELEASE_TAG="$GIT_TAG";
fi
if [ -z "$IS_GIT_TAG_MATCH_SEMVER" ]; then
    SUFFIX=${GIT_BRANCH//\//'-'}
    RELEASE_TAG="$RELEASE_TAG-$SUFFIX"
fi
echo "RELEASE_TAG=$RELEASE_TAG" >> $GITHUB_OUTPUT

case "${RUNNER_OS}" in
    Windows)
        export FIBJS_OS=windows
        ;;
    macOS)
        export FIBJS_OS=darwin
        ;;
    Linux)
        export FIBJS_OS=linux
        ;;
    *)
        echo "unsupported RUNNER_OS ${RUNNER_OS}";
        exit 1
        ;;
esac
echo "FIBJS_OS=$FIBJS_OS" >> $GITHUB_OUTPUT

case "${ARCH}" in
    i386)
        export FIBJS_ARCH=x86
        ;;
    amd64)
        export FIBJS_ARCH=x64
        ;;
    *)
        export FIBJS_ARCH=$ARCH
        ;;
esac
echo "FIBJS_ARCH=$FIBJS_ARCH" >> $GITHUB_OUTPUT