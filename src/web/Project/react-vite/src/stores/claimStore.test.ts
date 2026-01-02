import { describe, expect, it, beforeEach } from 'vitest';
import { useClaimStore } from './claimStore';

const STORAGE_KEY = 'vault-dem-claim';

function getPersistedState(): any {
  const raw = localStorage.getItem(STORAGE_KEY);
  expect(raw).toBeTruthy();
  return JSON.parse(raw!);
}

describe('claimStore persistence (Identity / POA / Timeline)', () => {
  beforeEach(async () => {
    localStorage.clear();
    // Reset store to a known baseline
    useClaimStore.getState().reset();
    // Ensure persisted storage is empty/baseline
    await useClaimStore.persist.rehydrate();
  });

  it('persists identity fields to localStorage and can rehydrate them', async () => {
    useClaimStore.getState().setIdentity({
      name: 'Jane Veteran',
      dob: '1990-01-01',
      email: 'jane@example.com',
      phone: '555-555-5555',
      entryDate: '2010-01-01',
      separationDate: '2014-01-01'
    });

    const raw1 = localStorage.getItem(STORAGE_KEY);
    expect(raw1).toBeTruthy();

    // Simulate refresh: reset store (overwrites), restore prior persisted snapshot, then rehydrate.
    useClaimStore.getState().reset();
    localStorage.setItem(STORAGE_KEY, raw1!);
    await useClaimStore.persist.rehydrate();

    const identity = useClaimStore.getState().data.identity;
    expect(identity.name).toBe('Jane Veteran');
    expect(identity.dob).toBe('1990-01-01');
    expect(identity.email).toBe('jane@example.com');
    expect(identity.phone).toBe('555-555-5555');
    expect(identity.entryDate).toBe('2010-01-01');
    expect(identity.separationDate).toBe('2014-01-01');
  });

  it('persists POA selection to localStorage and can rehydrate it', async () => {
    useClaimStore.getState().setPOA({
      type: 'VSO',
      organizationName: 'Veterans of Foreign Wars (VFW)',
      representativeName: 'Rep Name',
      email: 'rep@example.com'
    });

    const raw1 = localStorage.getItem(STORAGE_KEY);
    expect(raw1).toBeTruthy();

    useClaimStore.getState().reset();
    localStorage.setItem(STORAGE_KEY, raw1!);
    await useClaimStore.persist.rehydrate();

    const poa = useClaimStore.getState().data.poa;
    expect(poa?.type).toBe('VSO');
    expect(poa?.organizationName).toBe('Veterans of Foreign Wars (VFW)');
  });

  it('persists timeline events to localStorage and can rehydrate them', async () => {
    useClaimStore.getState().addTimelineEvent({
      id: 'tl_test_1',
      type: 'service',
      date: '2020-01-01',
      title: 'Deployed',
      notes: 'Unit XYZ'
    });

    const persisted = getPersistedState();
    expect(persisted?.state?.data?.timeline?.length).toBe(1);

    const raw1 = localStorage.getItem(STORAGE_KEY);
    useClaimStore.getState().reset();
    localStorage.setItem(STORAGE_KEY, raw1!);
    await useClaimStore.persist.rehydrate();

    const timeline = useClaimStore.getState().data.timeline;
    expect(timeline.length).toBe(1);
    expect(timeline[0].title).toBe('Deployed');
  });
});


