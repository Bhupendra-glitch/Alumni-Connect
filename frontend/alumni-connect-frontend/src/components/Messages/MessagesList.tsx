import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  TextField,
  InputAdornment,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
} from '@mui/material';
import {
  Search,
  Message,
  Send,
  Add,
} from '@mui/icons-material';

const MessagesList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');

  // Mock data for demonstration
  const [conversations] = useState([
    {
      id: 1,
      participant: {
        id: 1,
        name: 'John Doe',
        avatar: 'JD',
        lastMessage: 'Thanks for the opportunity!',
        timestamp: '2 hours ago',
        unread: 2,
      },
    },
    {
      id: 2,
      participant: {
        id: 2,
        name: 'Jane Smith',
        avatar: 'JS',
        lastMessage: 'Looking forward to the event',
        timestamp: '1 day ago',
        unread: 0,
      },
    },
    {
      id: 3,
      participant: {
        id: 3,
        name: 'Mike Johnson',
        avatar: 'MJ',
        lastMessage: 'Can we schedule a call?',
        timestamp: '3 days ago',
        unread: 1,
      },
    },
  ]);

  const [messages] = useState([
    {
      id: 1,
      sender: 'John Doe',
      content: 'Hi! I saw your job posting and I\'m very interested.',
      timestamp: '2 hours ago',
      isOwn: false,
    },
    {
      id: 2,
      sender: 'You',
      content: 'Great! Can you tell me more about your experience?',
      timestamp: '1 hour ago',
      isOwn: true,
    },
    {
      id: 3,
      sender: 'John Doe',
      content: 'I have 5 years of experience in software development...',
      timestamp: '30 minutes ago',
      isOwn: false,
    },
  ]);

  const handleStartConversation = () => {
    alert('Start conversation functionality will be implemented soon!');
  };

  const handleViewConversation = (conversation: any) => {
    setSelectedConversation(conversation);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // TODO: Implement send message functionality
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const filteredConversations = conversations.filter(conversation =>
    conversation.participant.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="lg">
      <Box mb={4}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4" component="h1">
            Messages
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleStartConversation}
          >
            New Message
          </Button>
        </Box>
        <Typography variant="body1" color="text.secondary">
          Connect and communicate with fellow alumni
        </Typography>
      </Box>


      <Grid container spacing={3}>
        {/* Conversations List */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <CardContent>
              <TextField
                fullWidth
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              
              <List>
                {filteredConversations.map((conversation) => (
                  <ListItem
                    key={conversation.id}
                    onClick={() => handleViewConversation(conversation)}
                    sx={{
                      borderRadius: 1,
                      mb: 1,
                      cursor: 'pointer',
                      backgroundColor: conversation.participant.unread > 0 ? 'action.hover' : 'transparent',
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {conversation.participant.avatar}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={conversation.participant.name}
                      secondary={conversation.participant.lastMessage}
                      primaryTypographyProps={{
                        fontWeight: conversation.participant.unread > 0 ? 'bold' : 'normal',
                      }}
                    />
                    <Box textAlign="right">
                      <Typography variant="caption" color="text.secondary">
                        {conversation.participant.timestamp}
                      </Typography>
                      {conversation.participant.unread > 0 && (
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            bgcolor: 'primary.main',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            mt: 0.5,
                          }}
                        >
                          {conversation.participant.unread}
                        </Box>
                      )}
                    </Box>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Messages Area */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ height: 600, display: 'flex', flexDirection: 'column' }}>
            {selectedConversation ? (
              <>
                <CardContent sx={{ flexGrow: 1, overflow: 'auto' }}>
                  <Box mb={2}>
                    <Typography variant="h6">
                      {selectedConversation.participant.name}
                    </Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  
                  <List>
                    {messages.map((message) => (
                      <ListItem
                        key={message.id}
                        sx={{
                          flexDirection: message.isOwn ? 'row-reverse' : 'row',
                          alignItems: 'flex-start',
                        }}
                      >
                        <ListItemAvatar sx={{ mx: 1 }}>
                          <Avatar sx={{ bgcolor: message.isOwn ? 'secondary.main' : 'primary.main' }}>
                            {message.isOwn ? 'You' : message.sender[0]}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={message.content}
                          secondary={message.timestamp}
                          sx={{
                            textAlign: message.isOwn ? 'right' : 'left',
                            backgroundColor: message.isOwn ? 'primary.light' : 'grey.100',
                            borderRadius: 2,
                            p: 1,
                            maxWidth: '70%',
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
                
                <Divider />
                <CardActions>
                  <TextField
                    fullWidth
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSendMessage();
                      }
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button
                            variant="contained"
                            startIcon={<Send />}
                            onClick={handleSendMessage}
                            disabled={!newMessage.trim()}
                          >
                            Send
                          </Button>
                        </InputAdornment>
                      ),
                    }}
                  />
                </CardActions>
              </>
            ) : (
              <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <Box textAlign="center">
                  <Message sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    Select a conversation to start messaging
                  </Typography>
                </Box>
              </CardContent>
            )}
          </Card>
        </Grid>
      </Grid>

      {/* New Message Dialog */}
      <Dialog open={false} onClose={() => {}} maxWidth="sm" fullWidth>
        <DialogTitle>
          New Message
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            New message functionality will be implemented soon!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {}}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MessagesList;

