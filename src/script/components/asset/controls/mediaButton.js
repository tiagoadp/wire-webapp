/*
 * Wire
 * Copyright (C) 2018 Wire Swiss GmbH
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see http://www.gnu.org/licenses/.
 *
 */

import ko from 'knockout';
import AssetTransferState from '../../../assets/AssetTransferState';

import '../assetLoader';

class MediaButtonComponent {
  /**
   * Construct a media button.
   *
   * @param {Object} params - Component parameters
   * @param {HTMLElement} params.src - Media source
   * @param {boolean} params.large - Display large button
   * @param {z.entity.File} params.asset - Asset file
   * @param {Object} componentInfo - Component information
   */
  constructor(params, componentInfo) {
    this.mediaElement = params.src;
    this.large = params.large;
    this.asset = params.asset;
    this.uploadProgress = params.uploadProgress;
    this.transferState = params.transferState;

    this.dispose = this.dispose.bind(this);
    this.onPlay = this.onPlay.bind(this);
    this.onPause = this.onPause.bind(this);

    if (this.large) {
      componentInfo.element.classList.add('media-button-lg');
    }

    this.isPlaying = ko.observable(false);

    const noop = () => {};

    this.onClickPlay = typeof params.play === 'function' ? () => params.play() : noop;
    this.onClickPause = typeof params.pause === 'function' ? () => params.pause() : noop;
    this.onClickCancel = typeof params.cancel === 'function' ? () => params.cancel() : noop;

    this.mediaElement.addEventListener('playing', this.onPlay);
    this.mediaElement.addEventListener('pause', this.onPause);
  }

  onPlay() {
    this.isPlaying(true);
  }

  onPause() {
    this.isPlaying(false);
  }

  isUploaded(transferState) {
    return transferState === AssetTransferState.UPLOADED;
  }

  isDownloading(transferState) {
    return transferState === AssetTransferState.DOWNLOADING;
  }

  isUploading(transferState) {
    return transferState === AssetTransferState.UPLOADING;
  }

  dispose() {
    this.mediaElement.removeEventListener('playing', this.onPlay);
    this.mediaElement.removeEventListener('pause', this.onPause);
  }
}

ko.components.register('media-button', {
  template: `
    <!-- ko if: isUploaded(transferState()) -->
      <div class='media-button media-button-play icon-play' data-bind="click: onClickPlay, visible: !isPlaying()" data-uie-name="do-play-media"></div>
      <div class='media-button media-button-pause icon-pause' data-bind="click: onClickPause, visible: isPlaying()" data-uie-name="do-pause-media"></div>
    <!-- /ko -->
    <!-- ko if: isDownloading(transferState()) -->
      <div class="media-button icon-close" data-bind="click: asset.cancel_download" data-uie-name="status-loading-media">
        <div class='media-button-border-fill'></div>
        <asset-loader params="large: large, loadProgress: asset.downloadProgress"></asset-loader>
      </div>
    <!-- /ko -->
      <!-- ko if: isUploading(transferState()) -->
      <div class="media-button icon-close" data-bind="click: onClickCancel" data-uie-name="do-cancel-media">
        <div class='media-button-border-fill'></div>
        <asset-loader params="large: large, loadProgress: uploadProgress"></asset-loader>
      </div>
    <!-- /ko -->
`,
  viewModel: {
    createViewModel(params, componentInfo) {
      return new MediaButtonComponent(params, componentInfo);
    },
  },
});
