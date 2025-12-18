declare module 'react-router-dom' {
  import * as React from 'react';

  export interface NavigateProps {
    to: string;
    replace?: boolean;
    state?: any;
  }

  export const Navigate: React.FC<NavigateProps>;

  export interface RouteProps {
    path?: string;
    element?: React.ReactNode;
    index?: boolean;
  }

  export const Route: React.FC<RouteProps>;

  export interface RoutesProps {
    children?: React.ReactNode;
  }

  export const Routes: React.FC<RoutesProps>;

  export interface RouterProps {
    children?: React.ReactNode;
  }

  export const BrowserRouter: React.FC<RouterProps>;
  export const HashRouter: React.FC<RouterProps>;
  export const Router: React.FC<RouterProps>;

  export interface LinkProps
    extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    to: string;
    replace?: boolean;
    state?: any;
  }

  export const Link: React.FC<LinkProps>;
  export const NavLink: React.FC<LinkProps>;

  export function useNavigate(): (to: string, options?: { replace?: boolean; state?: any }) => void;
  export function useParams<T extends Record<string, string | undefined>>(): T;
  export function useLocation(): { pathname: string; search: string; hash: string; state?: any };
  export function useMatch(pattern: string): { params: Record<string, string> } | null;
  export function useRoutes(routes: any[], location?: any): React.ReactElement | null;
}
