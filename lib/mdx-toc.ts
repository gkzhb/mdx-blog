import { Root } from "mdast";
import { Plugin } from "unified";
// <[Options?]|void[], Root>
import { toc, Options } from "mdast-util-toc";
import { fromMarkdown } from 'mdast-util-from-markdown'
import { mdxFromMarkdown } from 'mdast-util-mdx'
import { mdxjs } from 'micromark-extension-mdxjs'

const remarkMdxExportToc: Plugin<[Options?] | void[], Root> = (
  options: Options = {}
) => {
  return (node) => {
    const result = toc(
      node,
      Object.assign({}, options, {
        heading: options.heading || 'toc|table[ -]of[ -]contents?'
      })
    )

    if (
      result.endIndex === null ||
      result.index === null ||
      result.index === -1 ||
      !result.map
    ) {
      return
    }

    node.children = [
      ...node.children.slice(0, result.index),
      result.map,
      ...node.children.slice(result.endIndex)
    ]
  }
  return (node) => {
    const result = toc(
      node,
      Object.assign({}, options, {
        heading: options.heading || "toc|table[ -]of[ -]contents?",
      })
    );

    if (!result.map) {
      return;
    }

    node.children = [
      ...node.children,
      result.map,
    ];
    return;

    const content = `export const toc = ` + JSON.stringify(result.map)
    const tree = fromMarkdown(content, {
      extensions: [mdxjs()],
      mdastExtensions: [mdxFromMarkdown]
    })
    // console.log(content, tree)
    if (tree.children.length > 0) {
      node.children.push(tree.children[0])
    }
  };
};

export default remarkMdxExportToc;
