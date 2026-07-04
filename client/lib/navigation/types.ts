export type SynaTabBarRoute = {
  key: string;
  name: string;
};

export type SynaTabBarProps = {
  state: {
    index: number;
    routes: SynaTabBarRoute[];
  };
  navigation: {
    emit: (event: {
      type: 'tabPress';
      target: string;
      canPreventDefault: true;
    }) => { defaultPrevented: boolean };
    navigate: (name: string) => void;
  };
};
