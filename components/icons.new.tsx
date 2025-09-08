import React, { CSSProperties } from 'react';

type IconProps = {
  width?: number | string;
  height?: number | string;
  className?: string;
  style?: CSSProperties;
  size?: number | string;
};

const createIcon = (path: string, viewBox = '0 0 24 24') => {
  return ({ width = 24, height = 24, className, style, size }: IconProps) => {
    const iconWidth = size || width;
    const iconHeight = size || height;
    
    return (
      <svg 
        xmlns="http://www.w3.org/2000/svg"
        width={iconWidth}
        height={iconHeight}
        viewBox={viewBox}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        style={style}
      >
        {path}
      </svg>
    );
  };
};

// Basic Icons
export const PlusIcon = createIcon('<line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>');
export const ExternalLinkIcon = createIcon('<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line>');
export const CloseIcon = createIcon('<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>');
export const SettingsIcon = createIcon('<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>');
export const TrashIcon = createIcon('<polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>');
export const EyeIcon = createIcon('<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>');
export const EyeOffIcon = createIcon('<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>');
export const PlayIcon = createIcon('<polygon points="5 3 19 12 5 21 5 3"></polygon>');
export const ChatIcon = createIcon('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>');
export const SendIcon = createIcon('<line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>');
export const SunIcon = createIcon('<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>');
export const MoonIcon = createIcon('<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>');

// Node Type Icons
export const UserQueryIcon = createIcon('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>');
export const LLMIcon = createIcon('<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line>');
export const KnowledgeBaseIcon = createIcon('<path d="M3 3h18v18H3z"></path><path d="M21 9v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h10"></path><path d="M21 3v6h-6"></path>');
export const OutputIcon = createIcon('<polyline points="4 17 10 11 4 5"></polyline><line x1="12" y1="19" x2="20" y2="19"></line>');

// Component Icon
type ComponentType = 'userQuery' | 'llm' | 'knowledgeBase' | 'output' | 'settings' | 'plus' | 'trash' | 'close' | 'eye' | 'eyeOff' | 'play' | 'chat' | 'send' | 'sun' | 'moon' | 'externalLink';

interface ComponentIconProps extends IconProps {
  type: ComponentType;
}

export const ComponentIcon: React.FC<ComponentIconProps> = ({ type, size = 16, ...props }) => {
  const iconMap = {
    userQuery: <UserQueryIcon size={size} {...props} />,
    llm: <LLMIcon size={size} {...props} />,
    knowledgeBase: <KnowledgeBaseIcon size={size} {...props} />,
    output: <OutputIcon size={size} {...props} />,
    settings: <SettingsIcon size={size} {...props} />,
    plus: <PlusIcon size={size} {...props} />,
    trash: <TrashIcon size={size} {...props} />,
    close: <CloseIcon size={size} {...props} />,
    eye: <EyeIcon size={size} {...props} />,
    eyeOff: <EyeOffIcon size={size} {...props} />,
    play: <PlayIcon size={size} {...props} />,
    chat: <ChatIcon size={size} {...props} />,
    send: <SendIcon size={size} {...props} />,
    sun: <SunIcon size={size} {...props} />,
    moon: <MoonIcon size={size} {...props} />,
    externalLink: <ExternalLinkIcon size={size} {...props} />,
  };

  return iconMap[type] || <div>Icon not found</div>;
};

// Export all icons as default
const Icons = {
  PlusIcon,
  ExternalLinkIcon,
  CloseIcon,
  SettingsIcon,
  TrashIcon,
  EyeIcon,
  EyeOffIcon,
  PlayIcon,
  ChatIcon,
  SendIcon,
  SunIcon,
  MoonIcon,
  UserQueryIcon,
  LLMIcon,
  KnowledgeBaseIcon,
  OutputIcon,
  ComponentIcon,
};

export default Icons;
