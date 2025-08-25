import { useState } from "react";
import { 
  Folder, 
  FolderOpen, 
  FileText, 
  FileCode 
} from "lucide-react";

interface FileTreeNode {
  name: string;
  type: 'folder' | 'file';
  icon?: 'folder' | 'folder-open' | 'file' | 'file-code';
  children?: FileTreeNode[];
  isOpen?: boolean;
}

const initialFileTree: FileTreeNode[] = [
  {
    name: 'sharework/',
    type: 'folder',
    icon: 'folder',
    isOpen: true,
    children: [
      {
        name: 'backend/',
        type: 'folder',
        icon: 'folder-open',
        isOpen: true,
        children: [
          {
            name: 'src/',
            type: 'folder',
            icon: 'folder',
            isOpen: true,
            children: [
              {
                name: 'modules/',
                type: 'folder',
                icon: 'folder',
                children: [
                  { name: 'auth/', type: 'folder', icon: 'folder' },
                  { name: 'users/', type: 'folder', icon: 'folder' },
                  { name: 'projects/', type: 'folder', icon: 'folder' },
                  { name: 'tasks/', type: 'folder', icon: 'folder' },
                  { name: 'payments/', type: 'folder', icon: 'folder' },
                  { name: 'messaging/', type: 'folder', icon: 'folder' },
                ]
              },
              { name: 'routes/', type: 'folder', icon: 'folder' },
              { name: 'middleware/', type: 'folder', icon: 'folder' },
              { name: 'services/', type: 'folder', icon: 'folder' },
              { name: 'models/', type: 'folder', icon: 'folder' },
              { name: 'utils/', type: 'folder', icon: 'folder' },
            ]
          },
          {
            name: 'prisma/',
            type: 'folder',
            icon: 'folder',
            children: [
              { name: 'schema.prisma', type: 'file', icon: 'file-code' },
              { name: 'seed.ts', type: 'file', icon: 'file-code' },
            ]
          },
          { name: 'server.ts', type: 'file', icon: 'file-code' },
        ]
      },
      {
        name: 'frontend/',
        type: 'folder',
        icon: 'folder-open',
        isOpen: true,
        children: [
          {
            name: 'src/',
            type: 'folder',
            icon: 'folder',
            children: [
              { name: 'components/', type: 'folder', icon: 'folder' },
              { name: 'pages/', type: 'folder', icon: 'folder' },
              { name: 'hooks/', type: 'folder', icon: 'folder' },
              { name: 'context/', type: 'folder', icon: 'folder' },
              { name: 'utils/', type: 'folder', icon: 'folder' },
              { name: 'admin/', type: 'folder', icon: 'folder' },
              { name: 'main.tsx', type: 'file', icon: 'file-code' },
            ]
          },
        ]
      },
      {
        name: 'shared/',
        type: 'folder',
        icon: 'folder',
        children: [
          { name: 'types/', type: 'folder', icon: 'folder' },
          { name: 'constants/', type: 'folder', icon: 'folder' },
          { name: 'helpers/', type: 'folder', icon: 'folder' },
        ]
      },
      {
        name: 'scripts/',
        type: 'folder',
        icon: 'folder',
        children: [
          { name: 'migrations/', type: 'folder', icon: 'folder' },
          { name: 'seeds/', type: 'folder', icon: 'folder' },
          { name: 'deploy/', type: 'folder', icon: 'folder' },
          { name: 'tests/', type: 'folder', icon: 'folder' },
        ]
      },
      { name: '.env.example', type: 'file', icon: 'file' },
      { name: '.gitignore', type: 'file', icon: 'file' },
      { name: 'package.json', type: 'file', icon: 'file' },
    ]
  }
];

interface FileTreeItemProps {
  node: FileTreeNode;
  depth: number;
  onToggle: (path: string) => void;
  path: string;
}

function FileTreeItem({ node, depth, onToggle, path }: FileTreeItemProps) {
  const handleClick = () => {
    if (node.type === 'folder') {
      onToggle(path);
    }
  };

  const getIcon = () => {
    switch (node.icon) {
      case 'folder':
        return <Folder className="text-primary text-sm w-4 h-4" />;
      case 'folder-open':
        return <FolderOpen className="text-accent text-sm w-4 h-4" />;
      case 'file-code':
        return <FileCode className="text-accent text-sm w-4 h-4" />;
      default:
        return <FileText className="text-subtle text-sm w-4 h-4" />;
    }
  };

  const textColor = node.type === 'folder' ? 'text-text-primary' : 'text-subtle';

  return (
    <div>
      <div 
        className={`flex items-center space-x-2 py-1 cursor-pointer hover:bg-background/50 rounded-sm px-1`}
        style={{ marginLeft: `${depth * 16}px` }}
        onClick={handleClick}
        data-testid={`file-tree-item-${node.name.replace(/[^a-zA-Z0-9]/g, '-')}`}
      >
        {getIcon()}
        <span className={`font-mono text-sm ${textColor}`}>{node.name}</span>
      </div>
      
      {node.children && node.isOpen && (
        <div>
          {node.children.map((child, index) => (
            <FileTreeItem
              key={`${path}/${child.name}`}
              node={child}
              depth={depth + 1}
              onToggle={onToggle}
              path={`${path}/${child.name}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function FileTree() {
  const [fileTree, setFileTree] = useState<FileTreeNode[]>(initialFileTree);

  const toggleNode = (targetPath: string) => {
    const updateNode = (nodes: FileTreeNode[], path: string[]): FileTreeNode[] => {
      return nodes.map(node => {
        if (path.length === 1 && node.name === path[0]) {
          return { ...node, isOpen: !node.isOpen };
        } else if (path.length > 1 && node.name === path[0] && node.children) {
          return {
            ...node,
            children: updateNode(node.children, path.slice(1))
          };
        }
        return node;
      });
    };

    const pathParts = targetPath.split('/').filter(Boolean);
    setFileTree(prev => updateNode(prev, pathParts));
  };

  return (
    <div className="space-y-1">
      {fileTree.map((node, index) => (
        <FileTreeItem
          key={node.name}
          node={node}
          depth={0}
          onToggle={toggleNode}
          path={node.name}
        />
      ))}
    </div>
  );
}
