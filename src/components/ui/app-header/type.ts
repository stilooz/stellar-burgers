export type TAppHeaderUIProps = {
  userName: string | undefined;
  onConstructorClick?: () => void;
  onFeedClick?: () => void;
  onProfileClick?: () => void;
  onLogoClick?: () => void;
  isConstructorActive?: boolean;
  isFeedActive?: boolean;
  isProfileActive?: boolean;
};
