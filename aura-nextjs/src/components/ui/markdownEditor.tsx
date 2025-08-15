import dynamic from 'next/dynamic';
import '@uiw/react-markdown-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const MarkdownEditor = dynamic(
  () => import('@uiw/react-markdown-editor').then((mod) => mod.default),
  { ssr: false }
);

interface MarkDownInputProps {
  className?: string;
  value: string;
  prefixCls?: string;
  visible?: boolean;
  visibleEditor?: boolean;
  defaultValue?: string;
  placeholder?: string;
  height?: number;
  onChange: (value: string) => void;
}

function MarkDownInput(props: MarkDownInputProps) {
  const {
    className,
    value,
    prefixCls,
    visible,
    visibleEditor,
    defaultValue,
    placeholder,
    height,
    onChange,
  } = props;

  const handleChange = (value: string) => {
    // console.log('Markdown value changed:', value);
    onChange(value);
  };
  const handleScroll = (/*e: React.UIEvent<HTMLDivElement>*/) => {
    // console.log('Markdown editor scrolled:', e);
  };
  return (
    <div className='wmde-markdown-var'>
      <MarkdownEditor
        className={className}
        value={value}
        height={`${height || 200}px`}
        visible={visible}
        visibleEditor={visibleEditor}
        defaultValue={defaultValue}
        onChange={handleChange}
        toolbars={[
          'undo',
          'redo',
          'bold',
          'italic',
          'strike',
          'quote',
          'header',
          'ulist',
        ]}
        onScroll={handleScroll}
        prefixCls={prefixCls}
        placeholder={placeholder}
      />
    </div>
  );
}

export default MarkDownInput;
