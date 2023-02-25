import { createElement, FC, useEffect, useState } from 'react';
import { combineLatest, Observable, of, switchMap } from 'rxjs';

type ObservablesToProps<Props extends Record<string, unknown>> = { [K in keyof Props]: Observable<Props[K]> };

export const withObservables = <Props extends Record<string, unknown>>(Component: FC<Props>) => {
  return <PartProps extends Partial<Props>>(
    createMapObj: () => ObservablesToProps<PartProps>,
    defaultProps: PartProps
  ) => {
    const Container: FC<Omit<Props, keyof PartProps>> = props => {
      const [propsFromObservables, setPropsFromObservables] = useState<PartProps>(defaultProps);

      useEffect(() => {
        const mapObj = createMapObj();
        const obs = (Object.keys(mapObj) as (keyof typeof mapObj)[]).map(key =>
          mapObj[key].pipe(switchMap(value => of([key, value] as [keyof PartProps, PartProps[keyof PartProps]])))
        );
        const subscription = combineLatest(obs).subscribe(arr => {
          const partProps: Partial<PartProps> = {};
          arr.forEach(([key, value]) => (partProps[key] = value));
          setPropsFromObservables(partProps as PartProps);
        });
        return () => subscription.unsubscribe();
      }, []);

      return createElement(Component, { ...propsFromObservables, ...props } as Props);
    };

    Container.displayName = `WithObservables${Component.displayName}`;

    return Container;
  };
};
