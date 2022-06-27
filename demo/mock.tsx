import { ElementSchema } from '../src/index';

export const mockData: ElementSchema[] = [
  {
    componentName: 'Item1',
    props: {},
    elementProps: {
      bounds: {
        x: 0,
        y: 0,
        width: 100,
        height: 100,
      },
    },
  },

  {
    componentName: 'Item2',
    props: {
      text: '元素2',
    },
    elementProps: {
      bounds: {
        x: 120,
        y: 0,
        width: 100,
        height: 100,
      },
    },
  },
  {
    componentName: 'Chart',
    props: {},
    elementProps: {
      bounds: {
        x: 220,
        y: 110,
        width: 400,
        height: 300,
      },
    },
  },
];

type ElementSourceSchema = {
  label: string;
  data: ElementSchema;
};

export const mockSourceData: ElementSourceSchema[] = [
  {
    label: '柱状图',
    data: {
      componentName: 'Chart',
      props: {},
      elementProps: {
        bounds: {
          x: 100,
          y: 100,
          width: 400,
          height: 300,
        },
      },
    },
  },

  {
    label: 'Item1',
    data: {
      componentName: 'Item1',
      props: {
        text: '这个是item1',
      },
      elementProps: {
        bounds: {
          x: 100,
          y: 100,
          width: 100,
          height: 100,
        },
      },
    },
  },

  {
    label: 'Item2',
    data: {
      componentName: 'Item2',
      props: {},
      elementProps: {
        bounds: {
          x: 100,
          y: 100,
          width: 100,
          height: 100,
        },
      },
    },
  },
];
