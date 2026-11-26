
import React, { useState, useEffect, useMemo } from 'react';

import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Linking,
  BackHandler,
  Modal,
} from 'react-native';

import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

import topics from './data/topics';
import videos from './data/videos';
import images, { topicImage, topicIcon } from './data/images';

import QuizScreen from './screens/QuizScreen';
import Photo from './assets/components/Photo';
import VideoPlayer from './assets/components/videoplayer';
import useResponsive from './hooks/useResponsive';

import { colors, serif } from './theme';

const NAV = [
  { id: 'home', label: 'Home', icon: 'home-variant-outline' },
  { id: 'learn', label: 'Learn', icon: 'book-open-page-variant-outline' },
  { id: 'videos', label: 'Videos', icon: 'play-circle-outline' },
  { id: 'quiz', label: 'Quiz', icon: 'help-circle-outline' },
];

const TILES = [
  {
    id: 'learn',
    title: 'Learn',
    text: 'Understand the issues and the solutions.',
    img: 'forest',
  },
  {
    id: 'videos',
    title: 'Videos',
    text: 'Short, educational films about our planet.',
    img: 'water',
  },
  {
    id: 'quiz',
    title: 'Eco Quiz',
    text: 'Test what you know in 10 questions.',
    img: 'biodiversity',
  },
];

function Grid({ r, cols = r.columns, children }) {
  const w = r.cardWidth(cols);

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: r.gap }}>
      {React.Children.map(children, (c) => (
        <View style={{ width: w }}>{c}</View>
      ))}
    </View>
  );
}

export default function App() {
  const [screen, setScreen] = useState('home');
  const [topic, setTopic] = useState(null);
  const [playing, setPlaying] = useState(null);

  const r = useResponsive();
  const st = useMemo(
    () => makeStyles(r),
    [r.width, r.height]
  );

  const go = (s) => {
    setScreen(s);
    setTopic(null);
  };

  const openTopic = (t) => {
    setTopic(t);
    setScreen('details');
  };

  useEffect(() => {
    const sub = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (screen === 'details') {
          go('learn');
          return true;
        }

        if (screen !== 'home') {
          go('home');
          return true;
        }

        return false;
      }
    );

    return () => sub.remove();
  }, [screen]);

  const active = screen === 'details' ? 'learn' : screen;

  const Nav = () => (
    <View style={[st.nav, r.isTablet ? st.navTop : st.navBottom]}>
      {r.isTablet && <Text style={st.brand}>EcoPulse</Text>}

      <View style={st.navItems}>
        {NAV.map((n) => {
          const on = n.id === active;

          return (
            <Pressable
              key={n.id}
              onPress={() => go(n.id)}
              accessibilityRole="button"
              accessibilityLabel={n.label}
              style={[
                st.navItem,
                r.isTablet && st.navItemWide,
                on && (r.isTablet ? st.navOnWide : null),
              ]}
            >
              <Icon
                name={n.icon}
                size={22}
                color={on ? colors.forest : colors.muted}
              />

              <Text
                style={[
                  st.navText,
                  on && {
                    color: colors.forest,
                    fontWeight: '700',
                  },
                ]}
              >
                {n.label}
              </Text>

              {on && !r.isTablet && <View style={st.navDot} />}
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  const Back = ({ to, label }) => (
    <Pressable
      onPress={() => go(to)}
      hitSlop={10}
      style={st.back}
      accessibilityRole="button"
    >
      <Icon name="arrow-left" size={18} color={colors.moss} />
      <Text style={st.backText}>{label}</Text>
    </Pressable>
  );

  const Home = () => (
    <>
      <Photo source={images.hero} tint={0.35} style={st.hero}>
        <View style={st.heroInner}>
          <Text style={st.eyebrow}>ENVIRONMENTAL LEARNING</Text>

          <Text style={st.heroTitle}>
            Small actions.{'\n'}Big change.
          </Text>

          <Text style={st.heroText}>
            Learn how our planet is changing and what each of us can do to protect it.
          </Text>

          <Pressable
            style={({ pressed }) => [
              st.cta,
              pressed && st.pressed,
            ]}
            onPress={() => go('learn')}
            accessibilityRole="button"
          >
            <Text style={st.ctaText}>Start learning</Text>
            <Icon name="arrow-right" size={18} color={colors.forest} />
          </Pressable>
        </View>
      </Photo>

      <Text style={st.h2}>Explore</Text>

      <Grid r={r} cols={r.isDesktop ? 3 : r.isTablet ? 1 : 1}>
        {TILES.map((t) => (
          <Pressable
            key={t.id}
            onPress={() => go(t.id)}
            style={({ pressed }) => pressed && st.pressed}
            accessibilityRole="button"
          >
            <Photo source={images[t.img]} tint={0.5} style={st.tile}>
              <View style={st.tileInner}>
                <View style={{ flex: 1 }}>
                  <Text style={st.tileTitle}>{t.title}</Text>
                  <Text style={st.tileText}>{t.text}</Text>
                </View>

                <View style={st.round}>
                  <Icon name="arrow-right" size={20} color={colors.forest} />
                </View>
              </View>
            </Photo>
          </Pressable>
        ))}
      </Grid>

      <Text style={st.footer}>
        Together, we can protect our planet.
      </Text>
    </>
  );

  const Learn = () => (
    <>
      <Text style={st.eyebrowDark}>LEARN</Text>

      <Text style={st.pageTitle}>
        Issues shaping our planet
      </Text>

      <Text style={st.pageText}>
        Explore the causes, the effects and the practical solutions behind each challenge.
      </Text>

      <Grid r={r}>
        {topics.map((t) => (
          <Pressable
            key={t.id}
            onPress={() => openTopic(t)}
            style={({ pressed }) => [
              st.card,
              { flexGrow: 1 },
              pressed && st.pressed,
            ]}
            accessibilityRole="button"
          >
            <Photo
              source={images[topicImage[t.id]]}
              tint={0.15}
              style={st.cardImg}
            />

            <View style={st.cardBody}>
              <View style={st.chip}>
                <Icon
                  name={topicIcon[t.id]}
                  size={16}
                  color={colors.moss}
                />
              </View>

              <Text style={st.cardTitle}>{t.title}</Text>

              <Text style={st.cardText} numberOfLines={3}>
                {t.description}
              </Text>

              <View style={st.more}>
                <Text style={st.moreText}>Read more</Text>
                <Icon name="arrow-right" size={16} color={colors.moss} />
              </View>
            </View>
          </Pressable>
        ))}
      </Grid>
    </>
  );

  const Details = () => {
    if (!topic) return null;

    const blocks = [
      {
        h: 'Main causes',
        icon: 'alert-outline',
        items: topic.causes,
        color: colors.clay,
      },
      {
        h: 'Effects on our planet',
        icon: 'earth',
        items: topic.effects,
        color: colors.moss,
      },
      {
        h: 'What can we do?',
        icon: 'check-circle-outline',
        items: topic.solutions,
        color: colors.good,
      },
    ];

    return (
      <>
        <Back to="learn" label="All topics" />

        <Photo
          source={images[topicImage[topic.id]]}
          tint={0.45}
          style={st.detailHero}
        >
          <View style={st.detailHeroInner}>
            <Icon
              name={topicIcon[topic.id]}
              size={r.s(30)}
              color={colors.white}
            />

            <Text style={st.detailTitle}>{topic.title}</Text>
          </View>
        </Photo>

        <Text style={st.lead}>{topic.description}</Text>

        <Grid r={r} cols={r.isDesktop ? 3 : 1}>
          {blocks.map((b) => (
            <View
              key={b.h}
              style={[
                st.panel,
                { borderTopColor: b.color },
              ]}
            >
              <View style={st.panelHead}>
                <Icon
                  name={b.icon}
                  size={22}
                  color={b.color}
                />

                <Text style={st.panelTitle}>{b.h}</Text>
              </View>

              {b.items.map((i, n) => (
                <View key={n} style={st.row}>
                  <View
                    style={[
                      st.dot,
                      { backgroundColor: b.color },
                    ]}
                  />

                  <Text style={st.rowText}>{i}</Text>
                </View>
              ))}
            </View>
          ))}
        </Grid>

        <Pressable
          style={st.primary}
          onPress={() => go('learn')}
          accessibilityRole="button"
        >
          <Text style={st.primaryText}>
            Explore other topics
          </Text>
        </Pressable>
      </>
    );
  };

  const openSearch = (v) =>
    Linking.openURL(
      'https://www.youtube.com/results?search_query=' +
        encodeURIComponent(v.search)
    );

  const sheetW = Math.min(r.width - r.pad * 2, 800);

  const Videos = () => (
    <>
      <Text style={st.eyebrowDark}>WATCH</Text>

      <Text style={st.pageTitle}>Educational videos</Text>

      <Text style={st.pageText}>
        Short films that explain how we can protect the environment.
      </Text>

      <Grid r={r}>
        {videos.map((v) => (
          <View key={v.id} style={[st.card, { flexGrow: 1 }]}>
            <Pressable
              onPress={() =>
                v.youtubeId ? setPlaying(v) : openSearch(v)
              }
              accessibilityRole="button"
              accessibilityLabel={`Play ${v.title}`}
            >
              <Photo
                source={images[topicImage[v.id]]}
                tint={0.3}
                style={st.cardImg}
              >
                <View style={st.playWrap}>
                  <View style={st.play}>
                    <Icon
                      name="play"
                      size={26}
                      color={colors.forest}
                    />
                  </View>
                </View>
              </Photo>
            </Pressable>

            <View style={st.cardBody}>
              <Text style={st.tag}>{v.topic.toUpperCase()}</Text>

              <Text style={st.cardTitle}>{v.title}</Text>

              <Text style={[st.cardText, { flexGrow: 1 }]}>
                {v.description}
              </Text>

              <Pressable
                style={({ pressed }) => [
                  st.outline,
                  pressed && st.pressed,
                ]}
                accessibilityRole="link"
                onPress={() =>
                  v.youtubeId ? setPlaying(v) : openSearch(v)
                }
              >
                <Icon
                  name="play-circle-outline"
                  size={18}
                  color={colors.forest}
                />

                <Text style={st.outlineText}>
                  {v.youtubeId ? 'Watch in the app' : 'Find on YouTube'}
                </Text>
              </Pressable>
            </View>
          </View>
        ))}
      </Grid>
    </>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={st.safeArea}
        edges={['top', 'bottom']}
      >
        <StatusBar
          style="dark"
          backgroundColor={colors.bg}
          translucent={false}
        />

        <View style={st.container}>
          {r.isTablet && <Nav />}

          {screen === 'quiz' ? (
            <QuizScreen onBack={() => go('home')} />
          ) : (
            <ScrollView
              contentContainerStyle={st.content}
              showsVerticalScrollIndicator={false}
            >
              {screen === 'home' && <Home />}
              {screen === 'learn' && <Learn />}
              {screen === 'details' && <Details />}
              {screen === 'videos' && <Videos />}
            </ScrollView>
          )}

          {!r.isTablet && <Nav />}

          <Modal
            visible={!!playing}
            animationType="fade"
            transparent
            onRequestClose={() => setPlaying(null)}
          >
            <View style={st.backdrop}>
              <View style={[st.sheet, { width: sheetW }]}>
                <View style={st.sheetHead}>
                  <Text style={st.sheetTitle} numberOfLines={2}>
                    {playing?.title}
                  </Text>

                  <Pressable
                    onPress={() => setPlaying(null)}
                    hitSlop={12}
                    accessibilityRole="button"
                    accessibilityLabel="Close video"
                  >
                    <Icon
                      name="close"
                      size={24}
                      color={colors.ink}
                    />
                  </Pressable>
                </View>

                {playing && (
                  <VideoPlayer
                    videoId={playing.youtubeId}
                    width={sheetW - 32}
                  />
                )}

                <Text style={st.sheetText}>
                  {playing?.description}
                </Text>
              </View>
            </View>
          </Modal>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const makeStyles = (r) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.bg,
    },

    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },

    content: {
      padding: r.pad,
      paddingBottom: 48,
      width: '100%',
      maxWidth: r.contentWidth,
      alignSelf: 'center',
    },

    pressed: {
      opacity: 0.85,
      transform: [{ scale: 0.985 }],
    },

    // Navigation

    nav: {
      backgroundColor: colors.surface,
      borderColor: colors.line,
    },

    navBottom: {
      borderTopWidth: 1,
      paddingTop: 8,
      paddingBottom: 6,
    },

    navTop: {
      borderBottomWidth: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: r.pad,
      paddingVertical: 10,
    },

    navItems: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      flex: r.isTablet ? 0 : 1,
      gap: 6,
    },

    navItem: {
      alignItems: 'center',
      gap: 2,
      paddingVertical: 4,
      minWidth: 64,
    },

    navItemWide: {
      flexDirection: 'row',
      gap: 8,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 999,
    },

    navOnWide: {
      backgroundColor: colors.sage,
    },

    navText: {
      fontSize: 12,
      color: colors.muted,
    },

    navDot: {
      width: 5,
      height: 5,
      borderRadius: 3,
      backgroundColor: colors.clay,
      marginTop: 1,
    },

    brand: {
      fontFamily: serif,
      fontSize: 22,
      fontWeight: '700',
      color: colors.forest,
    },

    // Hero and tiles

    hero: {
      borderRadius: 28,
      minHeight: r.isTablet ? 400 : 330,
      justifyContent: 'flex-end',
    },

    heroInner: {
      padding: r.s(24),
      maxWidth: 560,
    },

    eyebrow: {
      color: '#E9F3E3',
      fontSize: 12,
      letterSpacing: 2,
      fontWeight: '700',
      marginBottom: 10,
    },

    heroTitle: {
      fontFamily: serif,
      color: colors.white,
      fontSize: r.s(38),
      lineHeight: r.s(44),
      fontWeight: '700',
    },

    heroText: {
      color: '#EEF5EC',
      fontSize: r.s(16),
      lineHeight: r.s(24),
      marginTop: 12,
      marginBottom: 20,
    },

    cta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      alignSelf: 'flex-start',
      backgroundColor: colors.white,
      paddingVertical: 13,
      paddingHorizontal: 20,
      borderRadius: 999,
    },

    ctaText: {
      color: colors.forest,
      fontWeight: '700',
      fontSize: 15,
    },

    h2: {
      fontFamily: serif,
      fontSize: r.s(26),
      color: colors.ink,
      fontWeight: '700',
      marginTop: 32,
      marginBottom: 14,
    },

    tile: {
      borderRadius: 22,
      height: r.s(128),
      justifyContent: 'flex-end',
    },

    tileInner: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 18,
      gap: 12,
    },

    tileTitle: {
      fontFamily: serif,
      color: colors.white,
      fontSize: r.s(22),
      fontWeight: '700',
    },

    tileText: {
      color: '#E6F0E4',
      fontSize: r.s(13),
      marginTop: 2,
    },

    round: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.white,
      alignItems: 'center',
      justifyContent: 'center',
    },

    footer: {
      textAlign: 'center',
      color: colors.muted,
      marginTop: 30,
      fontFamily: serif,
      fontSize: 15,
    },

    // Pages

    eyebrowDark: {
      color: colors.clay,
      fontSize: 12,
      letterSpacing: 2,
      fontWeight: '700',
      marginBottom: 8,
    },

    pageTitle: {
      fontFamily: serif,
      fontSize: r.s(32),
      color: colors.forest,
      fontWeight: '700',
      marginBottom: 8,
    },

    pageText: {
      fontSize: r.s(15),
      color: colors.muted,
      lineHeight: r.s(23),
      marginBottom: 22,
      maxWidth: 620,
    },

    card: {
      backgroundColor: colors.surface,
      borderRadius: 22,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.line,
    },

    cardImg: {
      height: r.s(150),
      justifyContent: 'center',
    },

    cardBody: {
      padding: r.s(18),
      flexGrow: 1,
    },

    chip: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: colors.sage,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
    },

    cardTitle: {
      fontFamily: serif,
      fontSize: r.s(20),
      color: colors.ink,
      fontWeight: '700',
      marginBottom: 6,
    },

    cardText: {
      fontSize: r.s(14),
      color: colors.muted,
      lineHeight: r.s(21),
    },

    more: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: 12,
    },

    moreText: {
      color: colors.moss,
      fontWeight: '700',
      fontSize: 14,
    },

    tag: {
      color: colors.clay,
      fontSize: 11,
      letterSpacing: 1.5,
      fontWeight: '700',
      marginBottom: 6,
    },

    playWrap: {
      alignItems: 'center',
    },

    play: {
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: 'rgba(255,255,255,0.92)',
      alignItems: 'center',
      justifyContent: 'center',
    },

    outline: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      borderWidth: 1.5,
      borderColor: colors.forest,
      borderRadius: 999,
      paddingVertical: 11,
      marginTop: 14,
    },

    outlineText: {
      color: colors.forest,
      fontWeight: '700',
      fontSize: 14,
    },

    // Video player

    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(8,24,16,0.72)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: r.pad,
    },

    sheet: {
      backgroundColor: colors.bg,
      borderRadius: 24,
      padding: 16,
    },

    sheetHead: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 12,
      marginBottom: 12,
    },

    sheetTitle: {
      flex: 1,
      fontFamily: serif,
      fontSize: r.s(20),
      fontWeight: '700',
      color: colors.forest,
    },

    sheetText: {
      fontSize: r.s(14),
      color: colors.muted,
      lineHeight: r.s(21),
      marginTop: 12,
    },

    // Details

    back: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 16,
      alignSelf: 'flex-start',
    },

    backText: {
      color: colors.moss,
      fontWeight: '700',
      fontSize: 15,
    },

    detailHero: {
      borderRadius: 26,
      height: r.isTablet ? 280 : 210,
      justifyContent: 'flex-end',
    },

    detailHeroInner: {
      padding: r.s(22),
      gap: 8,
    },

    detailTitle: {
      fontFamily: serif,
      color: colors.white,
      fontSize: r.s(34),
      fontWeight: '700',
    },

    lead: {
      fontSize: r.s(17),
      color: colors.ink,
      lineHeight: r.s(27),
      marginVertical: 22,
      maxWidth: 720,
    },

    panel: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: r.s(20),
      borderWidth: 1,
      borderColor: colors.line,
      borderTopWidth: 4,
      flexGrow: 1,
    },

    panelHead: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginBottom: 12,
    },

    panelTitle: {
      fontFamily: serif,
      fontSize: r.s(18),
      color: colors.ink,
      fontWeight: '700',
    },

    row: {
      flexDirection: 'row',
      gap: 12,
      alignItems: 'flex-start',
      marginBottom: 9,
    },

    dot: {
      width: 7,
      height: 7,
      borderRadius: 4,
      marginTop: r.s(9),
    },

    rowText: {
      flex: 1,
      fontSize: r.s(15),
      color: '#33463B',
      lineHeight: r.s(24),
    },

    primary: {
      backgroundColor: colors.forest,
      paddingVertical: 15,
      paddingHorizontal: 28,
      borderRadius: 999,
      alignItems: 'center',
      marginTop: 28,
      alignSelf: r.isTablet ? 'center' : 'stretch',
    },

    primaryText: {
      color: colors.white,
      fontSize: 15,
      fontWeight: '700',
    },
  });
