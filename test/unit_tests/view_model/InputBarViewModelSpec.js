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

'use strict';

// grunt test_init && grunt test_run:view_model/InputBarViewModel

describe('z.viewModel.content.InputBarViewModel', () => {
  let repositories;
  let viewModel;

  beforeAll(() => {
    return new TestFactory()
      .exposeSearchActors()
      .then(testFactory => testFactory.exposeConversationActors())
      .then(({repository}) => {
        repositories = repository;
      });
  });

  beforeEach(() => {
    viewModel = new z.viewModel.content.InputBarViewModel(
      undefined,
      {},
      {
        conversation: repositories.conversation,
        search: repositories.search,
        user: repositories.user,
      }
    );
  });

  describe('_createMentionEntity', () => {
    it('matches multibyte characters in mentioned user names', () => {
      const selectionStart = 5;
      const selectionEnd = 5;
      const inputValue = 'Hi @n';
      const userName = 'nqa1👨‍👩‍👧‍👦👨‍👩‍👦‍👦👨‍👩‍👧‍👧';

      const mentionCandidate = viewModel.getMentionCandidate(selectionStart, selectionEnd, inputValue);
      viewModel.editedMention(mentionCandidate);

      const userEntity = new z.entity.User(z.util.createRandomUuid());
      userEntity.name(userName);

      const mentionEntity = viewModel._createMentionEntity(userEntity);

      expect(mentionEntity.startIndex).toBe(3);
      expect(mentionEntity.length).toBe(38);
    });
  });
});
