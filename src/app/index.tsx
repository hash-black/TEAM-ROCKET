import { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const categories = {
  Foods: [
    {
      question: "Name a food that is usually eaten with your hands",
      answers: [
        { answer: "tempora", points: 30 },
        { answer: "pisbol", points: 25 },
        { answer: "pila tanan ke?", points: 20 },
        { answer: "pizout", points: 15 },
        { answer: "bitsh", points: 10 },
      ],
    },
    {
      question: "Name something sweet",
      answers: [
        { answer: "cake", points: 30 },
        { answer: "candy", points: 25 },
        { answer: "ice cream", points: 20 },
        { answer: "chocolate", points: 15 },
        { answer: "donut", points: 10 },
      ],
    },
  ],

  Animals: [
    {
      question: "Name an animal people keep as a pet",
      answers: [
        { answer: "dog", points: 30 },
        { answer: "cat", points: 25 },
        { answer: "bird", points: 20 },
        { answer: "fish", points: 15 },
        { answer: "hamster", points: 10 },
      ],
    },
    {
      question: "Name an animal that lives in the water",
      answers: [
        { answer: "fish", points: 30 },
        { answer: "shark", points: 25 },
        { answer: "whale", points: 20 },
        { answer: "dolphin", points: 15 },
        { answer: "octopus", points: 10 },
      ],
    },
  ],
};

type CategoryName = keyof typeof categories;

type SubmittedAnswer = {
  text: string;
  correct: boolean;
  points: number;
};

export default function Index() {
  const [screen, setScreen] = useState<"categories" | "game" | "results">(
    "categories",
  );

  const [selectedCategory, setSelectedCategory] = useState<CategoryName | null>(
    null,
  );

  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [answerInput, setAnswerInput] = useState("");
  const [score, setScore] = useState(0);
  const [submittedAnswers, setSubmittedAnswers] = useState<SubmittedAnswer[]>(
    [],
  );

  // TIMER
  useEffect(() => {
    if (screen !== "game") return;

    if (timeLeft <= 0) {
      setScreen("results");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previous) => previous - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [screen, timeLeft]);

  // START GAME
  const startGame = (category: CategoryName) => {
    const questions = categories[category];

    const randomQuestion =
      questions[Math.floor(Math.random() * questions.length)];

    setSelectedCategory(category);
    setCurrentQuestion(randomQuestion);
    setTimeLeft(60);
    setScore(0);
    setAnswerInput("");
    setSubmittedAnswers([]);
    setScreen("game");
  };

  // SUBMIT ANSWER
  const submitAnswer = () => {
    const cleanedAnswer = answerInput.trim().toLowerCase();

    if (!cleanedAnswer) return;

    const alreadySubmitted = submittedAnswers.some(
      (item) => item.text.toLowerCase() === cleanedAnswer,
    );

    if (alreadySubmitted) {
      setAnswerInput("");
      return;
    }

    const foundAnswer = currentQuestion.answers.find(
      (item: { answer: string; points: number }) =>
        item.answer.toLowerCase() === cleanedAnswer,
    );

    if (foundAnswer) {
      setScore((previous) => previous + foundAnswer.points);

      setSubmittedAnswers((previous) => [
        ...previous,
        {
          text: answerInput.trim(),
          correct: true,
          points: foundAnswer.points,
        },
      ]);
    } else {
      setSubmittedAnswers((previous) => [
        ...previous,
        {
          text: answerInput.trim(),
          correct: false,
          points: 0,
        },
      ]);
    }

    setAnswerInput("");
  };

  // PLAY AGAIN
  const playAgain = () => {
    if (selectedCategory) {
      startGame(selectedCategory);
    }
  };

  // CATEGORY SCREEN
  if (screen === "categories") {
    return (
      <View style={styles.container}>
        <Text style={styles.logo}>SOLO</Text>
        <Text style={styles.logoBottom}>FEUD</Text>

        <Text style={styles.tagline}>— TEST YOUR SPEED —</Text>

        <Text style={styles.sectionTitle}>Choose a category</Text>

        {(Object.keys(categories) as CategoryName[]).map((category) => (
          <Pressable
            key={category}
            style={[
              styles.categoryCard,
              category === "Foods" ? styles.foodCard : styles.animalCard,
            ]}
            onPress={() => startGame(category)}
          >
            <Text style={styles.categoryEmoji}>
              {category === "Foods" ? "🍔" : "🐶"}
            </Text>

            <View style={styles.categoryInfo}>
              <Text style={styles.categoryName}>{category}</Text>

              <Text style={styles.categoryDescription}>
                {category === "Foods"
                  ? "Answer food-related questions"
                  : "Name animals before the timer runs out"}
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </Pressable>
        ))}
      </View>
    );
  }

  // GAME SCREEN
  if (screen === "game") {
    return (
      <View style={styles.container}>
        <View style={styles.topRow}>
          <Text style={styles.back}>‹</Text>

          <View style={styles.categoryBadge}>
            <Text style={styles.badgeText}>
              {selectedCategory === "Foods" ? "🍔" : "🐶"}{" "}
              {selectedCategory?.toUpperCase()}
            </Text>
          </View>

          <View style={styles.scoreBadge}>
            <Text style={styles.scoreSmall}>SCORE</Text>
            <Text style={styles.scoreNumber}>{score}</Text>
          </View>
        </View>

        <View style={styles.timerCircle}>
          <Text style={styles.timer}>{timeLeft}</Text>
          <Text style={styles.seconds}>SECONDS</Text>
        </View>

        <View style={styles.questionCard}>
          <Text style={styles.question}>{currentQuestion?.question}</Text>
        </View>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Type an answer..."
            placeholderTextColor="#7186b8"
            value={answerInput}
            onChangeText={setAnswerInput}
            onSubmitEditing={submitAnswer}
            returnKeyType="done"
            autoCapitalize="none"
          />

          <Pressable style={styles.submit} onPress={submitAnswer}>
            <Text style={styles.submitText}>SUBMIT</Text>
          </Pressable>
        </View>

        <Text style={styles.answersTitle}>— ANSWERS —</Text>

        <ScrollView>
          {submittedAnswers.map((item, index) => (
            <View
              key={index}
              style={[
                styles.answer,
                item.correct ? styles.correct : styles.wrong,
              ]}
            >
              <Text style={styles.answerText}>
                {item.correct ? "✓" : "×"} {item.text}
              </Text>

              {item.correct && (
                <Text style={styles.answerPoints}>+{item.points}</Text>
              )}
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  // RESULTS
  const correctCount = submittedAnswers.filter((item) => item.correct).length;

  const wrongCount = submittedAnswers.filter((item) => !item.correct).length;

  const missedAnswers = currentQuestion.answers.filter(
    (answer: { answer: string; points: number }) =>
      !submittedAnswers.some(
        (submitted) =>
          submitted.correct &&
          submitted.text.toLowerCase() === answer.answer.toLowerCase(),
      ),
  );

  return (
    <View style={styles.container}>
      <Text style={styles.timeUp}>⏱ TIME'S UP!</Text>

      <View style={styles.finalScoreBox}>
        <Text style={styles.finalScore}>{score}</Text>
        <Text style={styles.finalLabel}>FINAL SCORE</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statBox, styles.correctBox]}>
          <Text style={styles.statIcon}>✓</Text>
          <Text style={styles.statNumber}>{correctCount}</Text>
          <Text style={styles.statLabel}>CORRECT</Text>
        </View>

        <View style={[styles.statBox, styles.wrongBox]}>
          <Text style={styles.statIcon}>×</Text>
          <Text style={styles.statNumber}>{wrongCount}</Text>
          <Text style={styles.statLabel}>WRONG</Text>
        </View>
      </View>

      <Text style={styles.missedTitle}>— ANSWERS YOU MISSED —</Text>

      <ScrollView>
        {missedAnswers.map(
          (item: { answer: string; points: number }, index: number) => (
            <View key={index} style={styles.missedAnswer}>
              <Text style={styles.missedText}>× {item.answer}</Text>

              <Text style={styles.missedPoints}>+{item.points}</Text>
            </View>
          ),
        )}
      </ScrollView>

      <Pressable style={styles.bigButton} onPress={playAgain}>
        <Text style={styles.bigButtonText}>↻ PLAY AGAIN</Text>
      </Pressable>

      <Pressable
        style={styles.outlineButton}
        onPress={() => setScreen("categories")}
      >
        <Text style={styles.outlineText}>▦ CHOOSE CATEGORY</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#03184b",
    padding: 22,
    paddingTop: 55,
  },

  logo: {
    color: "#fff",
    fontSize: 58,
    fontWeight: "900",
    textAlign: "center",
    textShadowColor: "#168cff",
    textShadowRadius: 12,
  },

  logoBottom: {
    color: "#ffc928",
    fontSize: 58,
    fontWeight: "900",
    textAlign: "center",
    marginTop: -15,
  },

  tagline: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 25,
  },

  sectionTitle: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 18,
  },

  categoryCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 22,
    marginBottom: 18,
    borderWidth: 2,
  },

  foodCard: {
    backgroundColor: "#ff8a00",
    borderColor: "#ffc928",
  },

  animalCard: {
    backgroundColor: "#087bf5",
    borderColor: "#00aaff",
  },

  categoryEmoji: {
    fontSize: 50,
    marginRight: 18,
  },

  categoryInfo: {
    flex: 1,
  },

  categoryName: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900",
  },

  categoryDescription: {
    color: "#fff",
    fontSize: 16,
    marginTop: 4,
  },

  arrow: {
    color: "#fff",
    fontSize: 45,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },

  back: {
    color: "#fff",
    fontSize: 45,
  },

  categoryBadge: {
    backgroundColor: "#092d78",
    borderWidth: 2,
    borderColor: "#087bf5",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 22,
  },

  badgeText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "900",
  },

  scoreBadge: {
    backgroundColor: "#ffc928",
    borderRadius: 18,
    padding: 8,
    minWidth: 65,
    alignItems: "center",
  },

  scoreSmall: {
    fontSize: 10,
    fontWeight: "bold",
  },

  scoreNumber: {
    fontSize: 22,
    fontWeight: "900",
  },

  timerCircle: {
    width: 165,
    height: 165,
    borderRadius: 90,
    borderWidth: 8,
    borderColor: "#ffc928",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },

  timer: {
    color: "#fff",
    fontSize: 52,
    fontWeight: "900",
  },

  seconds: {
    color: "#b8c7e8",
    fontWeight: "bold",
  },

  questionCard: {
    backgroundColor: "#073a91",
    borderWidth: 3,
    borderColor: "#008cff",
    borderRadius: 25,
    padding: 25,
    marginBottom: 18,
  },

  question: {
    color: "#fff",
    fontSize: 27,
    fontWeight: "900",
    textAlign: "center",
  },

  inputRow: {
    flexDirection: "row",
    gap: 10,
  },

  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 17,
    fontSize: 17,
  },

  submit: {
    backgroundColor: "#087bf5",
    borderWidth: 2,
    borderColor: "#00aaff",
    borderRadius: 18,
    paddingHorizontal: 22,
    justifyContent: "center",
  },

  submitText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "900",
  },

  answersTitle: {
    color: "#a9bde8",
    textAlign: "center",
    fontWeight: "bold",
    marginVertical: 15,
  },

  answer: {
    padding: 13,
    borderRadius: 15,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  correct: {
    backgroundColor: "#064f46",
    borderWidth: 2,
    borderColor: "#16e58b",
  },

  wrong: {
    backgroundColor: "#451b46",
    borderWidth: 2,
    borderColor: "#ff3f62",
  },

  answerText: {
    color: "#fff",
    fontSize: 16,
  },

  answerPoints: {
    color: "#16e58b",
    fontWeight: "bold",
    fontSize: 17,
  },

  timeUp: {
    color: "#fff",
    backgroundColor: "#073a91",
    borderWidth: 4,
    borderColor: "#ffc928",
    borderRadius: 35,
    padding: 15,
    textAlign: "center",
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 25,
  },

  finalScoreBox: {
    backgroundColor: "#061f59",
    borderWidth: 3,
    borderColor: "#087bf5",
    borderRadius: 28,
    alignItems: "center",
    padding: 20,
  },

  finalScore: {
    color: "#fff",
    fontSize: 65,
    fontWeight: "900",
  },

  finalLabel: {
    color: "#a9bde8",
    fontWeight: "bold",
  },

  statsRow: {
    flexDirection: "row",
    gap: 15,
    marginVertical: 20,
  },

  statBox: {
    flex: 1,
    padding: 15,
    borderRadius: 20,
    alignItems: "center",
  },

  correctBox: {
    backgroundColor: "#064f46",
    borderWidth: 3,
    borderColor: "#16e58b",
  },

  wrongBox: {
    backgroundColor: "#451b46",
    borderWidth: 3,
    borderColor: "#ff3f62",
  },

  statIcon: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },

  statNumber: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900",
  },

  statLabel: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },

  missedTitle: {
    color: "#a9bde8",
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 12,
  },

  missedAnswer: {
    backgroundColor: "#092d78",
    borderRadius: 15,
    padding: 15,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  missedText: {
    color: "#fff",
    fontSize: 16,
  },

  missedPoints: {
    color: "#fff",
    fontWeight: "bold",
  },

  bigButton: {
    backgroundColor: "#087bf5",
    borderRadius: 18,
    padding: 16,
    alignItems: "center",
    marginTop: 12,
  },

  bigButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "900",
  },

  outlineButton: {
    borderWidth: 2,
    borderColor: "#087bf5",
    borderRadius: 18,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },

  outlineText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "900",
  },
});
