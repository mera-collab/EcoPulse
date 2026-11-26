import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useAudioPlayer } from 'expo-audio';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

import questions from '../data/questions';
import images from '../data/images';
import Photo from '../assets/components/Photo';
import useResponsive from '../hooks/useResponsive';
import { colors, serif } from '../theme';

export default function QuizScreen({ onBack }) {
  const applause = useAudioPlayer(require('../assets/sounds/applause.mp3'));
  const r = useResponsive();
  const st = useMemo(() => makeStyles(r), [r.width, r.height]);

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[index];
  const answered = selected !== null;

  const choose = (i) => {
    if (answered) return;
    setSelected(i);
    if (i === q.correctAnswer) {
      setScore((s) => s + 1);
      try { applause.seekTo(0); applause.play(); } catch (e) {}
    }
  };
  const next = () => (index < questions.length - 1 ? (setIndex(index + 1), setSelected(null)) : setFinished(true));
  const restart = () => { setIndex(0); setSelected(null); setScore(0); setFinished(false); };

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <ScrollView contentContainerStyle={st.resultWrap}>
        <View style={st.trophy}><Icon name="trophy-outline" size={r.s(44)} color={colors.forest} /></View>
        <Text style={st.resultTitle}>Quiz complete</Text>
        <Text style={st.percentage}>{pct}%</Text>
        <Text style={st.scoreText}>{score} of {questions.length} correct</Text>
        <Text style={st.message}>
          {pct >= 80 ? 'Excellent work. You are an Eco Champion.'
            : pct >= 50 ? 'Good job. Keep learning about our planet.'
            : 'Keep practising. Every step helps our planet.'}
        </Text>
        <Pressable style={st.primary} onPress={restart}><Text style={st.primaryText}>Play again</Text></Pressable>
        <Pressable style={st.secondary} onPress={onBack}><Text style={st.secondaryText}>Back to home</Text></Pressable>
      </ScrollView>
    );
  }

  const state = (i) => (answered && i === q.correctAnswer ? 'ok' : answered && i === selected ? 'no' : 'idle');
  const palette = { ok: [colors.goodBg, colors.good], no: [colors.badBg, colors.bad], idle: [colors.surface, colors.line] };

  return (
    <ScrollView contentContainerStyle={st.content} showsVerticalScrollIndicator={false}>
      <Photo source={images.quiz} tint={0.45} style={st.banner}>
        <View style={{ padding: r.s(20) }}>
          <Text style={st.eyebrow}>ECO QUIZ</Text>
          <Text style={st.bannerTitle}>Test your knowledge</Text>
        </View>
      </Photo>

      <View style={st.infoRow}>
        <Text style={st.info}>Question {index + 1} of {questions.length}</Text>
        <Text style={st.info}>Score {score}</Text>
      </View>
      <View style={st.track}><View style={[st.fill, { width: `${((index + 1) / questions.length) * 100}%` }]} /></View>

      <View style={st.questionCard}><Text style={st.qText}>{q.question}</Text></View>

      <View style={st.options}>
        {q.options.map((o, i) => {
          const s = state(i);
          return (
            <Pressable key={i} disabled={answered} onPress={() => choose(i)} accessibilityRole="button"
              accessibilityLabel={`Option ${String.fromCharCode(65 + i)}: ${o}`}
              style={({ pressed }) => [st.option, { width: r.isTablet ? r.cardWidth(2) : '100%', backgroundColor: palette[s][0], borderColor: palette[s][1] }, pressed && { opacity: 0.8 }]}>
              <View style={[st.letter, s === 'ok' && { backgroundColor: colors.good }, s === 'no' && { backgroundColor: colors.bad }]}>
                {s === 'ok' ? <Icon name="check" size={16} color="#fff" /> : s === 'no' ? <Icon name="close" size={16} color="#fff" />
                  : <Text style={st.letterText}>{String.fromCharCode(65 + i)}</Text>}
              </View>
              <Text style={st.optionText}>{o}</Text>
            </Pressable>
          );
        })}
      </View>

      {answered && (
        <View style={st.feedback}>
          <Text style={[st.feedbackTitle, { color: selected === q.correctAnswer ? colors.good : colors.bad }]}>
            {selected === q.correctAnswer ? 'Correct' : 'Not quite right'}
          </Text>
          <Text style={st.explanation}>{q.explanation}</Text>
          <Pressable style={st.primary} onPress={next}>
            <Text style={st.primaryText}>{index === questions.length - 1 ? 'See my results' : 'Next question'}</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}

const makeStyles = (r) => StyleSheet.create({
  content: { padding: r.pad, paddingBottom: 48, width: '100%', maxWidth: r.contentWidth, alignSelf: 'center' },
  banner: { borderRadius: 24, minHeight: r.s(130), justifyContent: 'flex-end', marginBottom: 20 },
  eyebrow: { color: '#E9F3E3', fontSize: 12, letterSpacing: 2, fontWeight: '700', marginBottom: 6 },
  bannerTitle: { fontFamily: serif, color: '#fff', fontSize: r.s(28), fontWeight: '700' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  info: { color: colors.moss, fontWeight: '700', fontSize: r.s(14) },
  track: { height: 8, backgroundColor: colors.sage, borderRadius: 8, overflow: 'hidden', marginBottom: 20 },
  fill: { height: '100%', backgroundColor: colors.moss, borderRadius: 8 },
  questionCard: { backgroundColor: colors.surface, padding: r.s(22), borderRadius: 20, marginBottom: 16, borderWidth: 1, borderColor: colors.line },
  qText: { fontFamily: serif, color: colors.ink, fontSize: r.s(22), fontWeight: '700', lineHeight: r.s(31) },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: r.gap },
  option: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: r.s(16), borderRadius: 16, borderWidth: 1.5 },
  letter: { width: 30, height: 30, borderRadius: 15, backgroundColor: colors.sage, alignItems: 'center', justifyContent: 'center' },
  letterText: { color: colors.forest, fontWeight: '700', fontSize: 14 },
  optionText: { flex: 1, color: colors.ink, fontSize: r.s(16), lineHeight: r.s(22) },
  feedback: { backgroundColor: colors.surface, padding: r.s(20), borderRadius: 20, marginTop: 16, borderWidth: 1, borderColor: colors.line },
  feedbackTitle: { fontFamily: serif, fontSize: r.s(20), fontWeight: '700', marginBottom: 6 },
  explanation: { color: colors.muted, fontSize: r.s(15), lineHeight: r.s(23), marginBottom: 14 },
  primary: { backgroundColor: colors.forest, paddingVertical: 15, borderRadius: 999, alignItems: 'center', minWidth: 220 },
  primaryText: { color: '#fff', fontSize: r.s(15), fontWeight: '700' },
  secondary: { backgroundColor: colors.sage, paddingVertical: 15, borderRadius: 999, alignItems: 'center', marginTop: 12, minWidth: 220 },
  secondaryText: { color: colors.forest, fontSize: r.s(15), fontWeight: '700' },
  resultWrap: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 28, maxWidth: 520, width: '100%', alignSelf: 'center' },
  trophy: { width: r.s(92), height: r.s(92), borderRadius: r.s(46), backgroundColor: colors.sage, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  resultTitle: { fontFamily: serif, fontSize: r.s(30), color: colors.forest, fontWeight: '700' },
  percentage: { fontFamily: serif, color: colors.moss, fontSize: r.s(60), fontWeight: '700', marginTop: 8 },
  scoreText: { color: colors.muted, fontSize: r.s(17), marginBottom: 12 },
  message: { color: colors.ink, fontSize: r.s(16), textAlign: 'center', lineHeight: 24, marginBottom: 24 },
});