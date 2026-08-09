export type SynaTabBarRoute = {
  key: string;
  name: string;
};

export type SynaTabBarProps = {
  state: {
    index: number;
    routes: SynaTabBarRoute[];
  };
  descriptors: Record<
    string,
    {
      options: {
        tabBarStyle?: { display?: string } | unknown;
      };
    }
  >;
  navigation: {
    emit: (event: {
      type: 'tabPress';
      target: string;
      canPreventDefault: true;
    }) => { defaultPrevented: boolean };
    navigate: (name: string) => void;
  };
};
