export interface ShellNavigationItem {
  label: string;
  path?: string;
  icon?: string;
  description: string;
  children?: ShellNavigationItem[];
}
