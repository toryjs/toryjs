import { EditorComponent } from '@toryjs/form';

import { Comment } from './comment_view';
import { propGroup, boundProp } from '@toryjs/ui';
import { colors } from './enums';

export const CommentEditor: EditorComponent = {
  Component: Comment,
  title: 'Comment',
  control: 'Comment',
  icon: 'comment',
  props: propGroup('Comment', {
    content: boundProp(),
    header: boundProp({
      default: 'Comment'
    }),
    icon: boundProp({
      default: 'comments outline'
    }),
    color: boundProp({
      default: 'yellow',
      control: 'Select',
      props: {
        options: colors
      }
    })
  }),
  defaultProps: {
    header: 'Comment',
    icon: 'comments outline',
    color: 'yellow'
  }
};
