import { shallowMount } from '@vue/test-utils';

import Distance from '@/components/Distance';

describe('App.vue', () => {
  it('should create Distance component', () => {
    const wrapper = shallowMount(Distance, {});
    expect(wrapper).toBeTruthy();
  });

  it('should say hello world', () => {
    var arr = [];
    expect(arr).toHaveLength(0);
  });
});
