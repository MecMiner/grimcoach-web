export interface NavItem {
    label: string;
    href: string;
    isExternal?: boolean;
}

export interface HeaderProps {
    onOpenContributeModal: () => void;
    activeSection?: string;
}

export interface ModalBaseProps {
    isOpen: boolean;
    onClose: () => void;
}