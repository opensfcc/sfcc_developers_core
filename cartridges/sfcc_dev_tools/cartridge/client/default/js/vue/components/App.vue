<template>
    <div id="sfcc_dev_tools">
        <!-- Drawer -->
        <transition name="fade">
            <div class="devtool-drawer" v-if="drawerOpen && mounted && debugData">
                <button class="devtool-close-drawer" @click.prevent="closeDrawer()" data-devtool v-tooltip.left="{ content: 'Close Drawer', classes: 'devtool-tooltip', delay: { show: tooltipDelay } }">
                    <svg role="img"><use href="#devtool-close"/></svg>
                </button>

                <div class="devtool-menu">
                    <ul>
                        <li>
                            <button data-devtool @click.prevent="openDrawer('basket')" :class="{ 'active': section === 'basket' }">
                                <svg role="img"><use href="#devtool-basket"/></svg>
                                <span>Basket</span>
                                <span class="count" v-if="basketCount > 0">{{ basketCount }}</span>
                            </button>
                        </li>
                        <li>
                            <button data-devtool @click.prevent="openDrawer('benchmarks')" :class="{ 'active': section === 'benchmarks' }">
                                <svg role="img"><use href="#devtool-benchmarks"/></svg>
                                <span>Benchmarks</span>
                            </button>
                        </li>
                        <li>
                            <button data-devtool @click.prevent="openDrawer('customer')" :class="{ 'active': section === 'customer' }">
                                <svg role="img"><use href="#devtool-customer"/></svg>
                                <span>Customer</span>
                            </button>
                        </li>
                        <li>
                            <button data-devtool @click.prevent="openDrawer('geolocation')" :class="{ 'active': section === 'geolocation' }">
                                <svg role="img"><use href="#devtool-geolocation"/></svg>
                                <span>Geolocation</span>
                            </button>
                        </li>
                        <li>
                            <button data-devtool @click.prevent="openDrawer('messages', messageClass.replace('notice-', ''))" :class="{ 'active': section === 'messages' }">
                                <svg role="img"><use href="#devtool-messages"/></svg>
                                <span>Messages</span>
                                <span class="count" :class="messageClass" v-if="messageCount.total > 0">{{ messageCount.total }}</span>
                            </button>
                        </li>
                        <li>
                            <button data-devtool @click.prevent="openDrawer('preferences')" :class="{ 'active': section === 'preferences' }">
                                <svg role="img"><use href="#devtool-preferences"/></svg>
                                <span>Preferences</span>
                            </button>
                        </li>
                        <li>
                            <button data-devtool @click.prevent="openDrawer('session')" :class="{ 'active': section === 'session' }">
                                <svg role="img"><use href="#devtool-session"/></svg>
                                <span>Session</span>
                            </button>
                        </li>
                        <li>
                            <button data-devtool @click.prevent="openDrawer('site')" :class="{ 'active': section === 'site' }">
                                <svg role="img"><use href="#devtool-site"/></svg>
                                <span>Site</span>
                            </button>
                        </li>
                    </ul>
                </div>

                <!-- Basket Section -->
                <transition name="fade">
                    <div class="devtool-drawer-section section-basket tree-view" v-if="section === 'basket'">
                        <tree-view class="outputTree"
                            v-if="debugData.basket"
                            :data="sortObjectByKeys(debugData.basket)"
                            :options="{ rootObjectKey: 'basket', link: true, maxDepth: 1 }"
                        />
                        <span class="no-results" v-if="!debugData.basket">Basket is Empty</span>
                    </div>
                </transition>

                <!-- Benchmarks Section -->
                <transition name="fade">
                    <div :class="{ 'devtool-drawer-section section-benchmarks': debugData.benchmarks, 'devtool-drawer-section section-benchmarks tree-view': !debugData.benchmarks }" v-if="section === 'benchmarks'">
                        <!-- Search Filter -->
                        <input type="search" v-model="searchBenchmarks" class="search-input" placeholder="Filter Benchmarks" data-devtool v-tooltip.bottom="{ content: 'Filter Benchmarks by Label, Type & Parent', classes: 'devtool-tooltip devtool-tooltip-wide', delay: { show: tooltipDelay } }" />

                        <!-- Table -->
                        <table v-if="debugData.benchmarks" class="benchmarks">
                            <thead>
                                <tr>
                                    <th @click="sortBenchmarks('id')" :class="{ 'sorting': sortBenchmarksBy === 'id', 'sort-asc': sortBenchmarksBy === 'id' && sortBenchmarksDirection === -1, 'sort-desc': sortBenchmarksBy === 'id' && sortBenchmarksDirection === 1 }" v-tooltip.top="{ content: 'Sort By Order Created', classes: 'devtool-tooltip', delay: { show: tooltipDelay }}">
                                        Order
                                    </th>
                                    <th @click="sortBenchmarks('label')" :class="{ 'sorting': sortBenchmarksBy === 'label', 'sort-asc': sortBenchmarksBy === 'label' && sortBenchmarksDirection === -1, 'sort-desc': sortBenchmarksBy === 'label' && sortBenchmarksDirection === 1 }" v-tooltip.top="{ content: 'Sort By Label', classes: 'devtool-tooltip', delay: { show: tooltipDelay }}">
                                        Label
                                    </th>
                                    <th @click="sortBenchmarks('type')" :class="{ 'sorting': sortBenchmarksBy === 'type', 'sort-asc': sortBenchmarksBy === 'type' && sortBenchmarksDirection === -1, 'sort-desc': sortBenchmarksBy === 'type' && sortBenchmarksDirection === 1 }" v-tooltip.top="{ content: 'Sort By Type', classes: 'devtool-tooltip', delay: { show: tooltipDelay }}">
                                        Type
                                    </th>
                                    <th @click="sortBenchmarks('duration')" :class="{ 'sorting': sortBenchmarksBy === 'duration', 'sort-asc': sortBenchmarksBy === 'duration' && sortBenchmarksDirection === -1, 'sort-desc': sortBenchmarksBy === 'duration' && sortBenchmarksDirection === 1 }" v-tooltip.top="{ content: 'Sort By Duration', classes: 'devtool-tooltip', delay: { show: tooltipDelay }}">
                                        Duration
                                    </th>
                                    <th @click="sortBenchmarks('parent')" :class="{ 'sorting': sortBenchmarksBy === 'parent', 'sort-asc': sortBenchmarksBy === 'parent' && sortBenchmarksDirection === -1, 'sort-desc': sortBenchmarksBy === 'parent' && sortBenchmarksDirection === 1 }" v-tooltip.top="{ content: 'Sort By Parent', classes: 'devtool-tooltip', delay: { show: tooltipDelay }}">
                                        Parent
                                    </th>
                                </tr>
                            </thead>
                            <tbody v-if="sortedBenchmarks && sortedBenchmarks.length > 0">
                                <tr v-for="(benchmark, key) in sortedBenchmarks" :key="key">
                                    <td>{{ benchmark.id + 1 }}</td>
                                    <td class="label" v-tooltip.top="{ content: benchmark.label, classes: 'devtool-tooltip devtool-tooltip-wide', delay: { show: tooltipDelay * 5 } }">{{ benchmark.label }}</td>
                                    <td>{{ benchmark.type }}</td>
                                    <td :class="{ 'warning': benchmark.duration >= 200 && benchmark.duration < 500, 'danger': benchmark.duration >= 500 && benchmark.duration < 1000, 'alert': benchmark.duration >= 1000 }">{{ msToTime(benchmark.duration) }}</td>
                                    <td>{{ benchmark.parent ? benchmark.parent : 'N/A' }}</td>
                                </tr>
                            </tbody>
                            <tbody v-if="!sortedBenchmarks || sortedBenchmarks.length === 0">
                                <tr>
                                    <td colspan="5">
                                        No Search Results
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <!-- No Results -->
                        <div v-if="!debugData.benchmarks" class="no-results">
                            <span>No Benchmarks</span>
                            <a data-devtool href="https://github.com/sfccdevops/sfcc_developers_core/tree/develop/cartridges/sfcc_dev_tools#benchmarks" target="_blank">
                                Need Help?
                            </a>
                        </div>
                    </div>
                </transition>

                <!-- Customer Section -->
                <transition name="fade">
                    <div class="devtool-drawer-section section-customer tree-view" v-if="section === 'customer'">
                        <tree-view class="outputTree"
                            v-if="debugData.session.customer"
                            :data="sortObjectByKeys(debugData.session.customer)"
                            :options="{ rootObjectKey: 'customer', link: true, maxDepth: 1 }"
                        />
                        <span class="no-results" v-if="!debugData.session.customer">No Customer</span>
                    </div>
                </transition>

                <!-- Geolocation Section -->
                <transition name="fade">
                    <div class="devtool-drawer-section section-geolocation tree-view" v-if="section === 'geolocation'">
                        <tree-view class="outputTree"
                            v-if="debugData.geolocation"
                            :data="sortObjectByKeys(debugData.geolocation)"
                            :options="{ rootObjectKey: 'geolocation', link: true, maxDepth: 1 }"
                        />
                        <span class="no-results" v-if="!debugData.geolocation">No Geolocation</span>
                    </div>
                </transition>

                <!-- Messages Section -->
                <transition name="fade">
                    <div class="devtool-drawer-section section-messages log-view" v-if="section === 'messages'">
                        <div class="button-wrapper">
                            <button class="notice-debug" data-devtool
                                @click.prevent="openDrawer('messages', 'debug')"
                                :class="{ 'empty': messageCount.debug === 0, 'active': subsection === 'debug' }"
                            >
                                <span class="label">Debug</span>
                                <span class="count notice-debug">{{ messageCount.debug }}</span>
                            </button>
                            <button class="notice-error" data-devtool
                                @click.prevent="openDrawer('messages', 'error')"
                                :class="{ 'empty': messageCount.error === 0, 'active': subsection === 'error' }"
                            >
                                <span class="label">Error</span>
                                <span class="count notice-error">{{ messageCount.error }}</span>
                            </button>
                            <button class="notice-fatal" data-devtool
                                @click.prevent="openDrawer('messages', 'fatal')"
                                :class="{ 'empty': messageCount.fatal === 0, 'active': subsection === 'fatal' }"
                            >
                                <span class="label">Fatal</span>
                                <span class="count notice-fatal">{{ messageCount.fatal }}</span>
                            </button>
                            <button class="notice-info" data-devtool
                                @click.prevent="openDrawer('messages', 'info')"
                                :class="{ 'empty': messageCount.info === 0, 'active': subsection === 'info' }"
                            >
                                <span class="label">Info</span>
                                <span class="count notice-info">{{ messageCount.info }}</span>
                            </button>
                            <button class="notice-log" data-devtool
                                @click.prevent="openDrawer('messages', 'log')"
                                :class="{ 'empty': messageCount.log === 0, 'active': subsection === 'log' }"
                            >
                                <span class="label">Log</span>
                                <span class="count notice-log">{{ messageCount.log }}</span>
                            </button>
                            <button class="notice-warn" data-devtool
                                @click.prevent="openDrawer('messages', 'warn')"
                                :class="{ 'empty': messageCount.warn === 0, 'active': subsection === 'warn' }"
                            >
                                <span class="label">Warn</span>
                                <span class="count notice-warn">{{ messageCount.warn }}</span>
                            </button>
                        </div>

                        <!-- Debug Messages -->
                        <div class="subsection" v-if="subsection === 'debug' && debugData.messages && typeof debugData.messages.debug !== 'undefined'">
                            <messages :list="debugData.messages.debug" />
                        </div>

                        <!-- Error Messages -->
                        <div class="subsection" v-if="subsection === 'error' && debugData.messages && typeof debugData.messages.error !== 'undefined'">
                            <messages :list="debugData.messages.error" />
                        </div>

                        <!-- Fatal Messages -->
                        <div class="subsection" v-if="subsection === 'fatal' && debugData.messages && typeof debugData.messages.fatal !== 'undefined'">
                            <messages :list="debugData.messages.fatal" />
                        </div>

                        <!-- Info Messages -->
                        <div class="subsection" v-if="subsection === 'info' && debugData.messages && typeof debugData.messages.info !== 'undefined'">
                            <messages :list="debugData.messages.info" />
                        </div>

                        <!-- Log Messages -->
                        <div class="subsection" v-if="subsection === 'log' && debugData.messages && typeof debugData.messages.log !== 'undefined'">
                            <messages :list="debugData.messages.log" />
                        </div>

                        <!-- Warn Messages -->
                        <div class="subsection" v-if="subsection === 'warn' && debugData.messages && typeof debugData.messages.warn !== 'undefined'">
                            <messages :list="debugData.messages.warn" />
                        </div>

                        <!-- No Messages -->
                        <div class="subsection" v-if="!subsection">
                            <messages />
                        </div>
                    </div>
                </transition>

                <!-- Preferences Section -->
                <transition name="fade">
                    <div class="devtool-drawer-section section-preferences tree-view" v-if="section === 'preferences'">
                        <tree-view class="outputTree"
                            v-if="debugData.preferences"
                            :data="sortObjectByKeys(debugData.preferences)"
                            :options="{ rootObjectKey: 'preferences', link: true, maxDepth: 1 }"
                        />
                        <span class="no-results" v-if="!debugData.preferences">No Preferences</span>
                    </div>
                </transition>

                <!-- Session Section -->
                <transition name="fade">
                    <div class="devtool-drawer-section section-session tree-view" v-if="section === 'session'">
                        <tree-view class="outputTree"
                            v-if="debugData.session"
                            :data="sortObjectByKeys(debugData.session)"
                            :options="{ rootObjectKey: 'session', link: true, maxDepth: 1 }"
                        />
                        <span class="no-results" v-if="!debugData.session">No Session</span>
                    </div>
                </transition>

                <!-- Site Section -->
                <transition name="fade">
                    <div class="devtool-drawer-section section-site tree-view" v-if="section === 'site'">
                        <tree-view class="outputTree"
                            v-if="debugData.site"
                            :data="sortObjectByKeys(debugData.site)"
                            :options="{ rootObjectKey: 'site', link: true, maxDepth: 1, limitRenderDepth: 2 }"
                        />
                        <span class="no-results" v-if="!debugData.site">No Site</span>
                    </div>
                </transition>
            </div>
        </transition>

        <!-- Toolbar -->
        <transition name="fade">
            <div class="devtool-toolbar" v-if="toolbarShown && !drawerOpen && mounted && debugData" @click.self="resetToolbar()">
                <!-- Basket -->
                <div class="toolbar-button-wrapper">
                    <!-- Basket Popover -->
                    <transition name="fade">
                        <div class="devtool-popover basket" id="popoverBasket" ref="popoverBasket" role="tooltip" v-if="popovers.basket">
                            <div class="table">
                                <button data-devtool
                                    @click.prevent="openDrawer('basket')"
                                    :class="{ 'empty': !debugData.basket }"
                                    v-tooltip.right="{ content: basketCount > 0 ? 'View Full Basket Details' : 'Basket Empty', classes: 'devtool-tooltip', delay: { show: tooltipDelay } }"
                                >
                                    <span class="label">Items</span>
                                    <span class="count notice-default">{{ basketCount }}</span>
                                </button>
                                <button data-devtool
                                    @click.prevent="openDrawer('basket')"
                                    :class="{ 'empty': !debugData.basket }"
                                    v-tooltip.right="{ content: debugData.basket && debugData.basket.shipments && debugData.basket.shipments.length > 0 ? 'View Full Basket Details' : 'Basket Empty', classes: 'devtool-tooltip', delay: { show: tooltipDelay } }"
                                >
                                    <span class="label">Shipments</span>
                                    <span class="count notice-default">{{ debugData.basket && debugData.basket.shipments && debugData.basket.shipments.length ? debugData.basket.shipments.length : 0 }}</span>
                                </button>
                            </div>
                        </div>
                    </transition>

                    <!-- Basket Button -->
                    <button class="toolbar-button basket" id="popoverButtonBasket" ref="popoverButtonBasket" aria-describedby="popoverBasket" data-devtool
                        @click.prevent="togglePopover('basket')"
                        v-tooltip="{ content: 'Basket', classes: popovers.basket ? 'devtool-tooltip-disabled' : 'devtool-tooltip', delay: { show: tooltipDelay } }"
                        :class="{ 'active': popovers.basket, 'no-count': basketCount === 0, 'notice-good': basketCount > 0 }"
                    >
                        <span v-if="basketCount > 0">{{ basketCount }}</span>
                        <svg role="img"><use href="#devtool-basket"/></svg>
                    </button>
                </div>

                <!-- Benchmarks -->
                <div class="toolbar-button-wrapper">
                    <!-- Benchmarks Button -->
                    <button class="toolbar-button benchmarks no-count" id="popoverButtonSite" ref="popoverButtonSite" aria-describedby="popoverSite" data-devtool
                        @click.prevent="openDrawer('benchmarks')"
                        v-tooltip="{ content: 'Benchmarks', classes: popovers.benchmarks ? 'devtool-tooltip-disabled' : 'devtool-tooltip', delay: { show: tooltipDelay } }"
                        :class="{ 'active': popovers.benchmarks }"
                    >
                        <svg role="img"><use href="#devtool-benchmarks"/></svg>
                    </button>
                </div>

                <!-- Customer -->
                <div class="toolbar-button-wrapper">
                    <!-- Customer Popover -->
                    <transition name="fade">
                        <div class="devtool-popover customer" id="popoverCustomer" ref="popoverCustomer" role="tooltip" v-if="popovers.customer">
                            <div class="table">
                                <button data-devtool
                                    @click.prevent="openDrawer('customer')"
                                    v-tooltip.right="{ content: 'View Full Customer Details', classes: 'devtool-tooltip', delay: { show: tooltipDelay } }">
                                    <span class="label">Anonymous</span>
                                    <span class="count notice-default">
                                        {{ debugData.session.customer.anonymous ? '✓' : ' ' }}
                                    </span>
                                </button>
                                <button data-devtool
                                    @click.prevent="openDrawer('customer')"
                                    v-tooltip.right="{ content: 'View Full Customer Details', classes: 'devtool-tooltip', delay: { show: tooltipDelay } }">
                                    <span class="label">Authenticated</span>
                                    <span class="count notice-default">
                                        {{ debugData.session.customer.authenticated ? '✓' : ' ' }}
                                    </span>
                                </button>
                                <button data-devtool
                                    @click.prevent="openDrawer('customer')"
                                    v-tooltip.right="{ content: 'View Full Customer Details', classes: 'devtool-tooltip', delay: { show: tooltipDelay } }">
                                    <span class="label">External</span>
                                    <span class="count notice-default">
                                        {{ debugData.session.customer.externallyAuthenticated ? '✓' : ' ' }}
                                    </span>
                                </button>
                                <button data-devtool
                                    @click.prevent="openDrawer('customer')"
                                    v-tooltip.right="{ content: 'View Full Customer Details', classes: 'devtool-tooltip', delay: { show: tooltipDelay } }">
                                    <span class="label">Registered</span>
                                    <span class="count notice-default">
                                        {{ debugData.session.customer.registered ? '✓' : ' ' }}
                                    </span>
                                </button>
                            </div>
                        </div>
                    </transition>

                    <!-- Customer Button -->
                    <button class="toolbar-button customer no-count" id="popoverButtonCustomer" ref="popoverButtonCustomer" aria-describedby="popoverCustomer" data-devtool
                        @click.prevent="togglePopover('customer')"
                        v-tooltip="{ content: 'Customer', classes: popovers.customer ? 'devtool-tooltip-disabled' : 'devtool-tooltip', delay: { show: tooltipDelay } }"
                        :class="{ 'active': popovers.customer }"
                    >
                        <svg role="img"><use href="#devtool-customer"/></svg>
                    </button>
                </div>

                <!-- Geolocation -->
                <div class="toolbar-button-wrapper">
                    <!-- Geolocation Popover -->
                    <transition name="fade">
                        <div class="devtool-popover geolocation" id="popoverGeolocation" ref="popoverGeolocation" role="tooltip" v-if="popovers.geolocation">
                            <div class="table">
                                <button data-devtool
                                    @click.prevent="openDrawer('geolocation')"
                                    v-tooltip.right="{ content: 'View Full Geolocation Details', classes: 'devtool-tooltip', delay: { show: tooltipDelay } }">
                                    <span class="label" v-if="debugData.geolocation.city && debugData.geolocation.regionCode">
                                        {{ debugData.geolocation.city }},
                                        {{ debugData.geolocation.regionCode }}
                                        {{ debugData.geolocation.postalCode || '' }}
                                    </span>
                                    <span class="label" v-else-if="debugData.geolocation.city">
                                        {{ debugData.geolocation.city }}
                                    </span>
                                    <span class="label" v-else-if="debugData.geolocation.postalCode">
                                        {{ debugData.geolocation.postalCode }}
                                    </span>
                                    <span class="label" v-else-if="debugData.geolocation.countryCode">
                                        {{ debugData.geolocation.countryCode }}
                                    </span>
                                    <span class="label" v-else-if="debugData.geolocation.latitude && debugData.geolocation.longitude">
                                        {{ debugData.geolocation.latitude }}
                                        {{ debugData.geolocation.longitude }}
                                    </span>
                                    <span class="label" v-else>
                                        No Location Data
                                    </span>
                                </button>
                            </div>
                        </div>
                    </transition>

                    <!-- Geolocation Button -->
                    <button class="toolbar-button geolocation no-count" id="popoverButtonGeolocation" ref="popoverButtonGeolocation" aria-describedby="popoverGeolocation" data-devtool
                        @click.prevent="togglePopover('geolocation')"
                        v-tooltip="{ content: 'Geolocation', classes: popovers.geolocation ? 'devtool-tooltip-disabled' : 'devtool-tooltip', delay: { show: tooltipDelay } }"
                        :class="{ 'active': popovers.geolocation }"
                    >
                        <svg role="img"><use href="#devtool-geolocation"/></svg>
                    </button>
                </div>

                <!-- Messages -->
                <div class="toolbar-button-wrapper">
                    <!-- Messages Popover -->
                    <transition name="fade">
                        <div class="devtool-popover messages" id="popoverMessages" ref="popoverMessages" role="tooltip" v-if="popovers.messages">
                            <div class="table">
                                <button data-devtool
                                    @click.prevent="openDrawer('messages', 'debug')"
                                    :class="{ 'empty': messageCount.debug === 0 }"
                                    v-tooltip.right="{ content: messageCount.debug > 0 ? 'View Debug Messages' : 'No Debug Messages', classes: 'devtool-tooltip', delay: { show: tooltipDelay } }"
                                >
                                    <span class="label">Debug</span>
                                    <span class="count notice-debug">{{ messageCount.debug }}</span>
                                </button>
                                <button data-devtool
                                    @click.prevent="openDrawer('messages', 'error')"
                                    :class="{ 'empty': messageCount.error === 0 }"
                                    v-tooltip.right="{ content: messageCount.error > 0 ? 'View Error Messages' : 'No Error Messages', classes: 'devtool-tooltip', delay: { show: tooltipDelay } }"
                                >
                                    <span class="label">Error</span>
                                    <span class="count notice-error">{{ messageCount.error }}</span>
                                </button>
                                <button data-devtool
                                    @click.prevent="openDrawer('messages', 'fatal')"
                                    :class="{ 'empty': messageCount.fatal === 0 }"
                                    v-tooltip.right="{ content: messageCount.fatal > 0 ? 'View Fatal Messages' : 'No Fatal Messages', classes: 'devtool-tooltip', delay: { show: tooltipDelay } }"
                                >
                                    <span class="label">Fatal</span>
                                    <span class="count notice-fatal">{{ messageCount.fatal }}</span>
                                </button>
                                <button data-devtool
                                    @click.prevent="openDrawer('messages', 'info')"
                                    :class="{ 'empty': messageCount.info === 0 }"
                                    v-tooltip.right="{ content: messageCount.info > 0 ? 'View Info Messages' : 'No Info Messages', classes: 'devtool-tooltip', delay: { show: tooltipDelay } }"
                                >
                                    <span class="label">Info</span>
                                    <span class="count notice-info">{{ messageCount.info }}</span>
                                </button>
                                <button data-devtool
                                    @click.prevent="openDrawer('messages', 'log')"
                                    :class="{ 'empty': messageCount.log === 0 }"
                                    v-tooltip.right="{ content: messageCount.log > 0 ? 'View Log Messages' : 'No Log Messages', classes: 'devtool-tooltip', delay: { show: tooltipDelay } }"
                                >
                                    <span class="label">Log</span>
                                    <span class="count notice-log">{{ messageCount.log }}</span>
                                </button>
                                <button data-devtool
                                    @click.prevent="openDrawer('messages', 'warn')"
                                    :class="{ 'empty': messageCount.warn === 0 }"
                                    v-tooltip.right="{ content: messageCount.warn > 0 ? 'View Warn Messages' : 'No Warn Messages', classes: 'devtool-tooltip', delay: { show: tooltipDelay } }"
                                >
                                    <span class="label">Warn</span>
                                    <span class="count notice-warn">{{ messageCount.warn }}</span>
                                </button>
                            </div>
                        </div>
                    </transition>

                    <!-- Messages Button -->
                    <button class="toolbar-button messages" id="popoverButtonMessages" ref="popoverButtonMessages" aria-describedby="popoverMessages" data-devtool
                        @click.prevent="togglePopover('messages')"
                        v-tooltip="{ content: 'Messages', classes: popovers.messages ? 'devtool-tooltip-disabled' : 'devtool-tooltip', delay: { show: tooltipDelay } }"
                        :class="[{ 'active': popovers.messages, 'no-count': messageCount.total === 0 }, messageClass]"
                    >
                        <span v-if="messageCount.total > 0">{{ messageCount.total }}</span>
                        <svg role="img"><use href="#devtool-messages"/></svg>
                    </button>
                </div>

                <!-- Preferences -->
                <div class="toolbar-button-wrapper">
                    <!-- Preferences Button -->
                    <button class="toolbar-button preferences no-count" id="popoverButtonPreferences" ref="popoverButtonPreferences" aria-describedby="popoverPreferences" data-devtool
                        @click.prevent="openDrawer('preferences')"
                        v-tooltip="{ content: 'Preferences', classes: popovers.preferences ? 'devtool-tooltip-disabled' : 'devtool-tooltip', delay: { show: tooltipDelay } }"
                        :class="{ 'active': popovers.preferences }"
                    >
                        <svg role="img"><use href="#devtool-preferences"/></svg>
                    </button>
                </div>

                <!-- Session -->
                <div class="toolbar-button-wrapper">
                    <!-- Session Button -->
                    <button class="toolbar-button session no-count" id="popoverButtonSession" ref="popoverButtonSession" aria-describedby="popoverSession" data-devtool
                        @click.prevent="openDrawer('session')"
                        v-tooltip="{ content: 'Session', classes: popovers.session ? 'devtool-tooltip-disabled' : 'devtool-tooltip', delay: { show: tooltipDelay } }"
                        :class="{ 'active': popovers.session }"
                    >
                        <svg role="img"><use href="#devtool-session"/></svg>
                    </button>
                </div>

                <!-- Site -->
                <div class="toolbar-button-wrapper">
                    <!-- Site Button -->
                    <button class="toolbar-button site no-count" id="popoverButtonSite" ref="popoverButtonSite" aria-describedby="popoverSite" data-devtool
                        @click.prevent="openDrawer('site')"
                        v-tooltip="{ content: 'Site', classes: popovers.site ? 'devtool-tooltip-disabled' : 'devtool-tooltip', delay: { show: tooltipDelay } }"
                        :class="{ 'active': popovers.site }"
                    >
                        <svg role="img"><use href="#devtool-site"/></svg>
                    </button>
                </div>

                <!-- Open Info -->
                <a href="https://github.com/sfccdevops/sfcc_developers_core#readme" target="devtool-info" class="open-info" v-tooltip="{ content: 'SFCC Developer Core Info', classes: 'devtool-tooltip', delay: { show: tooltipDelay } }" data-devtool>
                    &#9432;
                </a>

                <!-- Close Toolbar -->
                <button class="hide-toolbar" @click="closeToolbar()" v-tooltip="{ content: 'Close SFCC Toolbar', classes: 'devtool-tooltip', delay: { show: tooltipDelay } }" data-devtool>
                    <svg role="img"><use href="#devtool-close"/></svg>
                </button>
            </div>
        </transition>

        <!-- Show Toolbar -->
        <transition name="fade">
            <button class="devtool-show-toolbar" data-devtool
                v-if="!toolbarShown && !drawerOpen && mounted"
                @click="openToolbar()"
                v-tooltip="{ content: 'Open SFCC Toolbar', classes: 'devtool-tooltip', delay: { show: tooltipDelay } }"
            >
                <svg role="img"><use href="#devtool-salesforce"/></svg>
            </button>
        </transition>

        <!-- SVG Sprites -->
        <svg xmlns="http://www.w3.org/2000/svg" id="sfcc-dev-tools-icons">
            <symbol id="devtool-basket" viewBox="0 0 48.12 47.06">
                <g fill="none" stroke="#FFFFFF" stroke-miterlimit="10">
                    <ellipse cx="19.41" cy="41.45" rx="3.68" ry="3.78" stroke-width="3.65"/>
                    <ellipse cx="35.07" cy="41.45" rx="3.68" ry="3.78" stroke-width="3.65"/>
                    <path d="M10 8h35.41c.52 0 .82.07.67.55L40.68 26c-.15.47-.55 1.05-.91 1.05H15.63c-.36 0-.76-.72-.91-1.21L9.32 8.73C9.17 8.25 9.47 8 10 8z" stroke-width="4"/>
                    <path stroke-linecap="round" stroke-width="3.65" d="M9.28 7.86L7.44 3.23M15.73 26.78c-.34 0-.73.39-.88.88L12 35.3"/>
                    <path stroke-linecap="round" stroke-width="4" d="M2 2h5M12 36h29"/>
                </g>
            </symbol>
            <symbol id="devtool-benchmarks" viewBox="0 0 64 64">
                <g fill="#FFFFFF" stroke="#FFFFFF" stroke-linejoin="round" stroke-width="1">
                    <path d="M33.8,11.9V4.8h6.2c1,0,1.8-0.8,1.8-1.8s-0.8-1.8-1.8-1.8H24.1c-1,0-1.8,0.8-1.8,1.8s0.8,1.8,1.8,1.8h6.2v7.1C17,12.8,6.5,23.8,6.5,37.3c0,14,11.4,25.5,25.5,25.5c14.1,0,25.5-11.4,25.5-25.5C57.5,23.8,47,12.8,33.8,11.9z M32,59.3c-12.1,0-22-9.9-22-22s9.9-22,22-22c12.1,0,22,9.9,22,22S44.1,59.3,32,59.3z"/>
                    <path d="M45.2,35.5H33.8V24.1c0-1-0.8-1.8-1.8-1.8c-1,0-1.8,0.8-1.8,1.8v11.4h-3.5c-1,0-1.8,0.8-1.8,1.8s0.8,1.8,1.8,1.8h3.5v3.5c0,1,0.8,1.8,1.8,1.8c1,0,1.8-0.8,1.8-1.8V39h11.4c1,0,1.8-0.8,1.8-1.8S46.2,35.5,45.2,35.5z"/>
                </g>
            </symbol>
            <symbol id="devtool-close" viewBox="0 0 33.84 33.67">
                <g fill="none" stroke="#FFFFFF" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4">
                    <path d="M2 2l29.84 29.67M31.84 2L2 31.67"/>
                </g>
            </symbol>
            <symbol id="devtool-customer" viewBox="0 0 44 46.99">
                <g fill="none" stroke="#FFFFFF" stroke-linecap="round" stroke-miterlimit="10" stroke-width="4">
                    <circle cx="22" cy="13" r="11"/>
                    <path d="M42 36.74v6.07c0 .58-.2 2.18-.78 2.18H3.28C2.71 45 2 43.39 2 42.81v-6.57c0-6.63 9-12 20-12s20 5.37 20 12z"/>
                </g>
            </symbol>
            <symbol id="devtool-geolocation" viewBox="0 0 36 46">
                <g fill="none" stroke="#FFFF" stroke-linecap="round" stroke-linejoin="round" stroke-width="4">
                    <path d="M18 2a15.82 15.82 0 0116 15.63A15.34 15.34 0 0130.83 27"/>
                    <circle cx="18" cy="17.63" r="5"/>
                    <path d="M18 44l12.83-17.03M18 2A15.82 15.82 0 002 17.63 15.34 15.34 0 005.17 27M18 44L5.17 26.97"/>
                </g>
            </symbol>
            <symbol id="devtool-messages" viewBox="0 0 46 42.83">
                <g fill="none" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round" stroke-width="4">
                    <path d="M15 32.08H3c-.55 0-1-.81-1-1.37V2.34c0-.56.45-.26 1-.26h40c.55 0 1-.3 1 .26v28.37c0 .56-.45 1.37-1 1.37H29M22 40.83l6.63-8.11M22 40.83l-6.62-8.11"/>
                </g>
            </symbol>
            <symbol id="devtool-preferences" viewBox="0 0 46 44">
                <g fill="none" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round" stroke-width="4">
                    <path d="M2 6h8M10 2h12v8H10zM22 6h22M44 22h-8M36 26H24v-8h12zM24 22H2M2 38h8M10 34h12v8H10zM22 38h22"/>
                </g>
            </symbol>
            <symbol id="devtool-salesforce" viewBox="0 0 32 32">
                <g fill="#FFFFFF" stroke-linecap="round">
                    <path d="M10 6c-3.9 0-7 3.1-7 7 0 .4.1.8.1 1.2-.7 1-1.1 2.2-1.1 3.5 0 3.4 2.8 6.2 6.2 6.3 1.3 1.2 2.9 2 4.8 2s3.6-.9 4.9-2.1h.1c1.6 0 2.9-.9 3.8-2.1.4.1.8.2 1.2.2 3.9 0 7-3.1 7-7s-3.1-7-7-7c-.7 0-1.3.2-2 .4-1.1-.9-2.5-1.4-4-1.4-.9 0-1.8.3-2.6.7C13.2 6.7 11.7 6 10 6zm0 2c1.4 0 2.6.5 3.5 1.4l.5.5.6-.3c.8-.4 1.5-.6 2.4-.6 1.2 0 2.3.4 3.2 1.2l.5.4.6-.2c.6-.2 1.2-.3 1.8-.3 2.8 0 5 2.2 5 5s-2.2 5-5 5c-.4 0-.9-.1-1.3-.2l-.8-.2-.4.7c-.5.9-1.4 1.6-2.6 1.6h-.3l-.5-.1-.3.4c-1 1-2.4 1.7-3.9 1.7s-2.8-.7-3.7-1.7l-.4-.3h-.7C5.9 22 4 20.1 4 17.7c0-1 .4-1.9 1-2.7l.3-.4-.1-.5c-.1-.3-.2-.7-.2-1.1 0-2.8 2.2-5 5-5z"/>
                </g>
            </symbol>
            <symbol id="devtool-session" viewBox="0 0 41.92 41.92">
                <g fill="none" stroke="#FFFFFF" stroke-linecap="round">
                    <circle cx="20.96" cy="20.96" r="19" stroke-miterlimit="10" stroke-width="3.92"/>
                    <path stroke-linejoin="round" stroke-width="4" d="M19.96 12.46v9.22l5.34 3.72"/>
                </g>
            </symbol>
            <symbol id="devtool-site" viewBox="0 0 40 46">
                <g fill="none" stroke="#FFFFFF" stroke-linejoin="round" stroke-width="4">
                    <path d="M13 44H2.88a.78.78 0 01-.88-.74V18M38 19v24.26a.78.78 0 01-.88.74H26"/>
                    <path stroke-linecap="round" d="M38 18.89L20 2 2 18.43"/>
                    <path d="M14 46V31h12v15"/>
                </g>
            </symbol>
        </svg>
    </div>
</template>

<script>
import Messages from './Messages'

export default {
    name: 'DevTools',
    components: {
        Messages
    },
    data() {
        return {
            basketCount: 0,
            debugData: {},
            drawerOpen: false,
            listeningForClicks: false,
            mounted: false,
            messageCount: {
                debug: 0,
                error: 0,
                fatal: 0,
                info: 0,
                log: 0,
                warn: 0,
                total: 0
            },
            popovers: {
                basket: false,
                customer: false,
                geolocation: false,
                messages: false,
                preferences: false,
                session: false,
                site: false
            },
            section: null,
            subsection: null,
            toolbarShown: false,
            tooltipDelay: 300,
            sortBenchmarksDirection: 1,
            sortBenchmarksBy: 'duration',
            searchBenchmarks: '',
        };
    },
    mounted() {
        const drawerOpen = localStorage.getItem('SFCC_DrawerOpen');
        const toolbarShown = localStorage.getItem('SFCC_ToolbarShown');
        const section = localStorage.getItem('SFCC_DrawerSection');
        const subsection = localStorage.getItem('SFCC_DrawerSubsection');

        if (drawerOpen) {
            this.drawerOpen = JSON.parse(drawerOpen);
        }

        if (toolbarShown) {
            this.toolbarShown = JSON.parse(toolbarShown);
        }

        if (section) {
            this.section = section;
        }

        if (subsection) {
            this.subsection = subsection;
        }

        this.getTotals();

        this.mounted = true;

        if (this.drawerOpen || this.toolbarShown) {
            this.eventListener();
        }

        this.reloadDrawer();
    },
    computed: {
        messageClass() {
            if (this.messageCount.fatal > 0) {
                return 'notice-fatal';
            } else if (this.messageCount.error > 0) {
                return 'notice-error';
            } else if (this.messageCount.warn > 0) {
                return 'notice-warn';
            } else if (this.messageCount.info > 0) {
                return 'notice-info';
            } else if (this.messageCount.debug > 0) {
                return 'notice-debug';
            } else if (this.messageCount.log > 0) {
                return 'notice-log';
            }

            return '';
        },
        sortedBenchmarks() {
            const type = this.sortBenchmarksBy === 'id' || this.sortBenchmarksBy === 'duration' ? 'number' : 'string'
            const direction = this.sortBenchmarksDirection
            const key = this.sortBenchmarksBy

            const sorted = Object.values(this.debugData.benchmarks).sort(this.sortMethods(type, key, direction))

            if (this.searchBenchmarks) {
                return sorted.filter(benchmark => {
                    const query = this.searchBenchmarks.toLowerCase()
                    const hasLabel = benchmark.label.toLowerCase().includes(query)
                    const hasType = benchmark.type.toLowerCase().includes(query)
                    const hasParent = benchmark.parent && benchmark.parent.toLowerCase().includes(query)

                    return hasLabel || hasType || hasParent
                })
            }

            return sorted
        }
    },
    methods: {
        cleanDrawerOutput() {
            setTimeout(() => {
                document.querySelectorAll('span.tree-view-item-key').forEach((elm) => {
                    let text = elm.innerText;
                    elm.innerText = text.replace(/"/g, '');
                });
            }, 10);
        },
        closeDrawer() {
            this.drawerOpen = false;
            this.section = null;
            this.subsection = null;
        },
        closeToolbar() {
            this.resetToolbar();
            this.toolbarShown = false;
        },
        eventHandler(evt) {
            // Only pay attention to elements that are likely to trigger AJAX calls and not part of this devtool
            const canTriggerAjax = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'];
            if (canTriggerAjax.indexOf(evt.target.tagName) > -1 && (!evt.target.hasAttribute || (evt.target.hasAttribute && !evt.target.hasAttribute('data-devtool')))) {
                clearTimeout(this.debugTimout);
                this.debugTimout = setTimeout(this.fetchData, 1000);
            }
        },
        eventListener() {
            if (!this.drawerOpen && !this.toolbarShown && this.listeningForClicks) {
                // Nothing is open that we can render to, so kill event listeners
                clearTimeout(this.debugTimout);
                document.removeEventListener('click', this.eventHandler, { passive: true });
                document.removeEventListener('change', this.eventHandler, { passive: true });
                this.listeningForClicks = false;
            } else if (!this.listeningForClicks) {
                // We just opened the Drawer or Toolbar so let's listen for events
                document.addEventListener('click', this.eventHandler, { passive: true });
                document.addEventListener('change', this.eventHandler, { passive: true });
                this.listeningForClicks = true;
                // Let's go ahead and fetch the latest data too
                this.fetchData();
            }
        },
        getTotals() {
            if (!this.debugData) {
                return;
            }

            const msg = this.debugData.messages;

            this.messageCount.benchmarks = (msg && typeof msg.benchmarks !== 'undefined') ? msg.benchmarks.length : 0;
            this.messageCount.debug = (msg && typeof msg.debug !== 'undefined') ? msg.debug.length : 0;
            this.messageCount.error = (msg && typeof msg.error !== 'undefined') ? msg.error.length : 0;
            this.messageCount.fatal = (msg && typeof msg.fatal !== 'undefined') ? msg.fatal.length : 0;
            this.messageCount.info = (msg && typeof msg.info !== 'undefined') ? msg.info.length : 0;
            this.messageCount.log = (msg && typeof msg.log !== 'undefined') ? msg.log.length : 0;
            this.messageCount.warn = (msg && typeof msg.warn !== 'undefined') ? msg.warn.length : 0;
            this.messageCount.total = Object.keys(this.messageCount).reduce((sum, key) => sum + parseInt(this.messageCount[key] || 0), 0);

            if (this.debugData.basket && typeof this.debugData.basket.productQuantityTotal !== 'undefined') {
                this.basketCount = this.debugData.basket.productQuantityTotal;
            }
        },
        async fetchData() {
            // TODO: Pass over timestamp from last call to fetch new messages only
            const response = await this.axios.get(window.SFCC_DevToolsURL);

            if (response && typeof response.data !== 'undefined') {
                if (typeof response.data.basket !== 'undefined') {
                    this.debugData.basket = response.data.basket;
                }

                if (typeof response.data.benchmarks !== 'undefined') {
                    this.debugData.benchmarks = response.data.benchmarks;
                }

                if (typeof response.data.geolocation !== 'undefined') {
                    this.debugData.geolocation = response.data.geolocation;
                }

                if (typeof response.data.preferences !== 'undefined') {
                    this.debugData.preferences = response.data.preferences;
                }

                if (typeof response.data.session !== 'undefined') {
                    this.debugData.session = response.data.session;
                }

                if (typeof response.data.site !== 'undefined') {
                    this.debugData.site = response.data.site;
                }

                if (typeof response.data.messages !== 'undefined') {
                    this.debugData.messages = response.data.messages;

                    // create and dispatch console event
                    const event = new CustomEvent('devtools', {
                        detail: response.data.messages
                    });

                    document.dispatchEvent(event);
                }

                this.cleanDrawerOutput();
                this.getTotals();
                this.reloadDrawer();
            }
        },
        msToTime(ms) {
            let seconds = (ms / 1000).toFixed(6).replace(/\.?0+$/, '');
            let minutes = (ms / (1000 * 60)).toFixed(6).replace(/\.?0+$/, '');
            let hours = (ms / (1000 * 60 * 60)).toFixed(6).replace(/\.?0+$/, '');

            if (!ms || ms === 0) return 'N/A';
            else if (seconds < 1) return ms + ' ms';
            else if (seconds < 60) return seconds + ' sec';
            else if (minutes < 60) return minutes + ' min';
            else return hours + ' hrs';
        },
        openDrawer(section, subsection) {
            this.resetToolbar();

            setTimeout(() => {
                this.section = section;
                this.subsection = subsection;
                this.drawerOpen = true;
            }, 10);
        },
        openToolbar() {
            this.toolbarShown = true;
        },
        reloadDrawer() {
            // Fix weird issue with drawer not rendering data on first load
            if (this.drawerOpen && this.section) {
                var currentSection = this.section;
                var currentSubSection = this.subsection;

                this.openDrawer(null, null);

                setTimeout(() => {
                    this.openDrawer(currentSection, currentSubSection);
                }, 500);
            }
        },
        resetToolbar(ignore) {
            Object.keys(this.popovers).forEach((id) => {
                if (!ignore || ignore !== id) {
                    this.popovers[id] = false;
                }
            });
        },
        sortBenchmarks(key) {
            if (this.sortBenchmarksBy === key) {
                this.sortBenchmarksDirection *= -1
            }

            this.sortBenchmarksBy = key
        },
        sortMethods(type, key, direction) {
            switch (type) {
                case 'string': {
                    return direction === 1 ?
                    (a, b) => b[key] > a[key] ? -1 : a[key] > b[key] ? 1 : 0 :
                    (a, b) => a[key] > b[key] ? -1 : b[key] > a[key] ? 1 : 0
                }
                case 'number': {
                    return direction === 1 ?
                    (a, b) => Number(b[key]) - Number(a[key]) :
                    (a, b) => Number(a[key]) - Number(b[key])
                }
            }
        },
        sortObjectByKeys(obj) {
            if (!obj) {
                return obj;
            }

            const isArray = obj instanceof Array;
            let sortedObj = {};

            if (isArray) {
                sortedObj = obj.map((item) => this.sortObjectByKeys(item));
            } else {
                let keys = Object.keys(obj);
                keys.sort(function(key1, key2) {
                    key1 = key1.toLowerCase();
                    key2 = key2.toLowerCase();

                    if (key1 < key2) { return -1; }
                    if (key1 > key2) { return 1; }

                    return 0;
                });

                for (let index in keys) {
                    let key = keys[index];
                    if (typeof obj[key] === 'object') {
                        sortedObj[key] = this.sortObjectByKeys(obj[key]);
                    } else {
                        sortedObj[key] = obj[key];
                    }
                }
            }

            return sortedObj;
        },
        togglePopover(id) {
            this.resetToolbar(id);
            this.popovers[id] = !this.popovers[id];
        }
    },
    watch: {
        drawerOpen: {
            handler() {
                localStorage.setItem('SFCC_DrawerOpen', this.drawerOpen);
                this.eventListener();
            }
        },
        section: {
            handler() {
                localStorage.setItem('SFCC_DrawerSection', this.section);
                this.cleanDrawerOutput();
            }
        },
        subsection: {
            handler() {
                localStorage.setItem('SFCC_DrawerSubsection', this.subsection);
                this.cleanDrawerOutput();
            }
        },
        toolbarShown: {
            handler() {
                localStorage.setItem('SFCC_ToolbarShown', this.toolbarShown);
                this.eventListener();
            }
        }
    }
};
</script>
