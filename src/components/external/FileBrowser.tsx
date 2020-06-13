import React, { useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { FileArray, FileData, ThumbnailGenerator } from '../../typedef';
import { ChonkyFilesContext, ChonkyFolderChainContext } from '../../util/context';
import { ErrorMessage } from '../internal/ErrorMessage';
import { Logger } from '../../util/logger';
import { validateFileArray } from '../../util/validation';
import { ContextComposer, ContextProviderData } from '../internal/ContextComposer';

export interface FileBrowserProps {
    /**
     * List of files that will be displayed in the main container. The provided value
     * **must** be an array, where each element is either `null` or an object that
     * satisfies the `FileData` type. If an element is `null`, a loading placeholder
     * will be displayed in its place.
     */
    files: FileArray;

    /**
     * The current folder hierarchy. This should be an array of `files`, every
     * element should either be `null` or an object of `FileData` type. The first
     * element should represent the top-level directory, and the last element
     * should be the current folder.
     */
    folderChain?: FileArray;

    /**
     * The function that determines the thumbnail image URL for a file. It gets a file object as the input, and
     * should return a `string` or `null`. It can also return a promise that resolves into a `string` or `null`.
     * [See relevant section](#section-displaying-file-thumbnails).
     */
    thumbnailGenerator?: ThumbnailGenerator;

    /**
     * Maximum delay between the two clicks in a double click, in milliseconds.
     */
    doubleClickDelay?: number;

    /**
     * The function that is called whenever file selection changes.
     * [See relevant section](#section-managing-file-selection).
     */
    onSelectionChange?: (selection: Selection) => void;

    /**
     * The flag that completely disables file selection functionality. If any handlers depend on file selections, their
     * input will look like no files are selected.
     */
    disableSelection?: boolean;

    /**
     * The flag that completely disables drag & drop functionality.
     * [See relevant section](#section-managing-file-selection).
     */
    disableDragNDrop?: boolean;

    /**
     * The flag that determines whether Chonky should fill the height parent container. When set to `true`, the maximum
     * height of the file browser will be limited to the height of the parent container, and scrollbar will be shown
     * when necessary. When set to `false`, file browser height will be extended to display all files at the same time.
     */
    fillParentContainer?: boolean;

    /**
     * The initial file view. This should be set using the `FileView` enum. Users can change file view using the
     * controls in the top bar.
     * [See relevant section](#section-setting-file-browser-options).
     */
    view?: any;

    /**
     * Initial values for the file view options. Users can toggle all of these using the "Options" dropdown.
     * [See relevant section](#section-setting-file-browser-options).
     */
    options?: any;

    /**
     * The file object property that files are initially sorted by. This can be a string corresponding to one of the
     * file properties, or a function that takes in a `FileData` object and returns some value. This should can be set
     * using the `SortProperty` enum. Users can change the sort property by clicking on column names in detailed view.
     * [See relevant section](#section-setting-file-browser-options).
     */
    sortProperty?: string | ((file: FileData) => any);

    /**
     * The order in which the files are presented. This should be set using the `SortOrder` enum. Users can change the
     * sort order by clicking on column names in detailed view.
     * [See relevant section](#section-setting-file-browser-options).
     */
    sortOrder?: any;

    /**
     * Icon component
     */
    Icon?: any;

    /**
     * Map of default icons
     */
    icons?: any;
}

export const FileBrowser: React.FC<FileBrowserProps> = (props) => {
    const { files, children } = props;
    const folderChain = props.folderChain ? props.folderChain : null;

    const fileArrayErrors = validateFileArray(files);
    if (fileArrayErrors.length > 0) {
        const errorMessage =
            `The "files" prop passed to ${FileBrowser.name} did not pass validation. ` +
            `The following errors were encountered:`;
        Logger.error(errorMessage, '\n -', fileArrayErrors.join('\n - '));
        return <ErrorMessage message={errorMessage} bullets={fileArrayErrors} />;
    }

    const folderChainErrors = validateFileArray(folderChain, true);
    if (folderChainErrors.length > 0) {
        const errorMessage =
            `The "folder" prop passed to ${FileBrowser.name} did not pass validation. ` +
            `The following errors were encountered:`;
        Logger.error(errorMessage, '\n -', folderChainErrors.join('\n - '));
        return <ErrorMessage message={errorMessage} bullets={folderChainErrors} />;
    }

    const sortedFiles = files;

    type ContextData<T = any> = { context: React.Context<T>; value: T };
    const contexts: ContextData[] = [
        {
            context: ChonkyFilesContext,
            value: sortedFiles,
        },
        {
            context: ChonkyFolderChainContext,
            value: folderChain,
        },
    ];

    const contextProviders = useMemo<ContextProviderData[]>(
        () =>
            contexts.map((data) => ({
                provider: data.context.Provider,
                value: data.value,
            })),
        contexts.map((data) => data.value)
    );

    return (
        <DndProvider backend={HTML5Backend}>
            <ContextComposer providers={contextProviders}>
                <div className="chonky-root">{children ? children : null}</div>
            </ContextComposer>
        </DndProvider>
    );
};
