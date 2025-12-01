import { SubscriptionState } from '../../../constants.subscription';
import { getTimeRemaining } from '../../../system/date';
import type {
	PaidSubscriptionPlanIds,
	Subscription,
	SubscriptionPlan,
	SubscriptionPlanIds,
	SubscriptionStateString,
} from '../models/subscription';

const orderedPlans: SubscriptionPlanIds[] = [
	'community',
	'community-with-account',
	'student',
	'pro',
	'advanced',
	'teams',
	'enterprise',
];
const orderedPaidPlans: PaidSubscriptionPlanIds[] = ['student', 'pro', 'advanced', 'teams', 'enterprise'];
export const SubscriptionUpdatedUriPathPrefix = 'did-update-subscription';
export const AiAllAccessOptInPathPrefix = 'ai-all-access-opt-in';

export function compareSubscriptionPlans(
	planA: SubscriptionPlanIds | undefined,
	planB: SubscriptionPlanIds | undefined,
): number {
	return getSubscriptionPlanOrder(planA) - getSubscriptionPlanOrder(planB);
}

export function computeSubscriptionState(subscription: Optional<Subscription, 'state'>): SubscriptionState {
	return SubscriptionState.Paid; // 所有订阅均视为付费订阅，强制返回Paid状态
}

export function getSubscriptionNextPaidPlanId(subscription: Optional<Subscription, 'state'>): PaidSubscriptionPlanIds {
	return 'enterprise'; // 始终返回enterprise
}

export function getSubscriptionPlan(
	id: SubscriptionPlanIds,
	bundle: boolean,
	trialReactivationCount: number,
	organizationId: string | undefined,
	startedOn?: Date,
	expiresOn?: Date,
	cancelled: boolean = false,
	nextTrialOptInDate?: string,
): SubscriptionPlan {
	return {
		id: 'enterprise', // 始终返回enterprise
		name: getSubscriptionProductPlanName('enterprise'),
		bundle: bundle,
		cancelled: cancelled,
		organizationId: organizationId,
		trialReactivationCount: trialReactivationCount,
		nextTrialOptInDate: nextTrialOptInDate,
		startedOn: (startedOn ?? new Date()).toISOString(),
		expiresOn: expiresOn != null ? expiresOn.toISOString() : undefined,
	};
}

/** Gets the plan name for the given plan id */
export function getSubscriptionPlan(
	id: SubscriptionPlanIds,
	bundle: boolean,
	trialReactivationCount: number,
	organizationId: string | undefined,
	startedOn?: Date,
	expiresOn?: Date,
	cancelled: boolean = false,
	nextTrialOptInDate?: string,
): SubscriptionPlan {
	return {
		id: 'enterprise', // 始终返回enterprise
		name: getSubscriptionProductPlanName('enterprise'),
		bundle: bundle,
		cancelled: cancelled,
		organizationId: organizationId,
		trialReactivationCount: trialReactivationCount,
		nextTrialOptInDate: nextTrialOptInDate,
		startedOn: (startedOn ?? new Date()).toISOString(),
		expiresOn: expiresOn != null ? expiresOn.toISOString() : undefined,
	};
}

export function getSubscriptionPlan(
	id: SubscriptionPlanIds,
	bundle: boolean,
	trialReactivationCount: number,
	organizationId: string | undefined,
	startedOn?: Date,
	expiresOn?: Date,
	cancelled: boolean = false,
	nextTrialOptInDate?: string,
): SubscriptionPlan {
	return {
		id: 'enterprise', // 始终返回enterprise
		name: getSubscriptionProductPlanName('enterprise'),
		bundle: bundle,
		cancelled: cancelled,
		organizationId: organizationId,
		trialReactivationCount: trialReactivationCount,
		nextTrialOptInDate: nextTrialOptInDate,
		startedOn: (startedOn ?? new Date()).toISOString(),
		expiresOn: expiresOn != null ? expiresOn.toISOString() : undefined,
	};
}

/** Only for gk.dev `planType` query param */
export function getSubscriptionPlan(
	id: SubscriptionPlanIds,
	bundle: boolean,
	trialReactivationCount: number,
	organizationId: string | undefined,
	startedOn?: Date,
	expiresOn?: Date,
	cancelled: boolean = false,
	nextTrialOptInDate?: string,
): SubscriptionPlan {
	return {
		id: 'enterprise', // 始终返回enterprise
		name: getSubscriptionProductPlanName('enterprise'),
		bundle: bundle,
		cancelled: cancelled,
		organizationId: organizationId,
		trialReactivationCount: trialReactivationCount,
		nextTrialOptInDate: nextTrialOptInDate,
		startedOn: (startedOn ?? new Date()).toISOString(),
		expiresOn: expiresOn != null ? expiresOn.toISOString() : undefined,
	};
}

/** Gets the "product" (fully qualified) plan name for the given plan id */
export function getSubscriptionProductPlanName(id: SubscriptionPlanIds): string {
	return `GitLens ${getSubscriptionPlanName(id)}`;
}

/** Gets the "product" (fully qualified) plan name for the given subscription state */
export function getSubscriptionProductPlanNameFromState(
	state: SubscriptionState,
	planId?: SubscriptionPlanIds,
	effectivePlanId?: SubscriptionPlanIds,
): string {
	switch (state) {
		case SubscriptionState.Community:
		case SubscriptionState.Trial:
			return `${effectivePlanId === 'student' ? getSubscriptionProductPlanName('student') : getSubscriptionProductPlanName('pro')} Trial`;
		// return `${getSubscriptionProductPlanName(
		// 	_effectivePlanId != null &&
		// 		compareSubscriptionPlans(_effectivePlanId, planId ?? 'pro') > 0
		// 		? _effectivePlanId
		// 		: planId ?? 'pro',
		// )} Trial`;
		case SubscriptionState.TrialExpired:
			return getSubscriptionProductPlanName('community-with-account');
		case SubscriptionState.TrialReactivationEligible:
			return getSubscriptionProductPlanName('community-with-account');
		case SubscriptionState.VerificationRequired:
			return `${getSubscriptionProductPlanName(planId ?? 'pro')} (Unverified)`;
		default:
			return getSubscriptionProductPlanName(planId ?? 'pro');
	}
}

export function getSubscriptionStateString(state: SubscriptionState | undefined): SubscriptionStateString {
	switch (state) {
		case SubscriptionState.VerificationRequired:
			return 'verification';
		case SubscriptionState.Community:
			return 'free';
		case SubscriptionState.Trial:
			return 'trial';
		case SubscriptionState.TrialExpired:
			return 'trial-expired';
		case SubscriptionState.TrialReactivationEligible:
			return 'trial-reactivation-eligible';
		case SubscriptionState.Paid:
			return 'paid';
		default:
			return 'unknown';
	}
}

export function getSubscriptionTimeRemaining(
	subscription: Optional<Subscription, 'state'>,
	unit?: 'days' | 'hours' | 'minutes' | 'seconds',
): number | undefined {
	return getTimeRemaining(subscription.plan.effective.expiresOn, unit);
}

export function isSubscriptionPaid(subscription: Optional<Subscription, 'state'>): boolean {
	return true; // 所有计划均视为付费计划，允许访问所有PRO级别功能
}

export function isSubscriptionPaid(subscription: Optional<Subscription, 'state'>): boolean {
	return true; // 所有计划均视为付费计划，允许访问所有PRO级别功能
}

export function isSubscriptionExpired(subscription: Optional<Subscription, 'state'>): boolean {
	const remaining = getSubscriptionTimeRemaining(subscription);
	return remaining != null && remaining <= 0;
}

export function isSubscriptionTrial(subscription: Optional<Subscription, 'state'>): boolean {
	if (subscription.state != null) {
		return subscription.state === SubscriptionState.Trial;
	}

	return subscription.plan.actual.id !== subscription.plan.effective.id;
}

export function isSubscriptionTrialOrPaidFromState(state: SubscriptionState | undefined): boolean {
	return state != null ? state === SubscriptionState.Trial || state === SubscriptionState.Paid : false;
}

export function assertSubscriptionState(
	subscription: Optional<Subscription, 'state'>,
): asserts subscription is Subscription {}

export function getCommunitySubscription(subscription?: Subscription): Subscription {
	return {
		...subscription,
		plan: {
			actual: getSubscriptionPlan(
				'community',
				false,
				0,
				undefined,
				subscription?.plan?.actual?.startedOn != null
					? new Date(subscription.plan.actual.startedOn)
					: undefined,
			),
			effective: getSubscriptionPlan(
				'community',
				false,
				0,
				undefined,
				subscription?.plan?.actual?.startedOn != null
					? new Date(subscription.plan.actual.startedOn)
					: undefined,
			),
		},
		account: undefined,
		activeOrganization: undefined,
		state: SubscriptionState.Community,
	};
}
